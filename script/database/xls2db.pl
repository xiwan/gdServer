#!/usr/bin/perl

use utf8;
use strict;
use warnings;

use Encode;
use Pod::Usage;
use Data::Dumper;
use MongoDB;
use MongoDB::OID;
use Spreadsheet::WriteExcel;
use Getopt::Long qw(GetOptionsFromArray);
use List::Util;

use lib './script/database';
use MongoConf;

use ExcelParser;
use Conf;

our $CONFIG_PATH = "./config/env/json/";

# 設定
our $SETTINGS = +{};

load_mongo_conf();

#########################

our $DB_SETTINGS = $SETTINGS->{database};
our $COLUMN_TYPE = $Conf::COLUMN_TYPE;
our $SHEET_MAPPING = $Conf::SHEET_MAPPING;

our $dbh = MongoDB::MongoClient->new(
	host => $SETTINGS->{host}, 
	find_master => 1, 
	username => $DB_SETTINGS->{user}, 
	password => $DB_SETTINGS->{password}, 
	db_name => $DB_SETTINGS->{database});

sub load_mongo_conf {
	my $setting = MongoConf::load_mongo_conf($CONFIG_PATH, @ARGV);
	$SETTINGS->{database} = $setting;
	my $servers = $SETTINGS->{database}->{replSet}->{servers};

	$SETTINGS->{host} = 'mongodb://';
	for my $item (@$servers) {
		$SETTINGS->{host} .= $item->{host}.':'.$item->{port}.', ';
	}
	# print $SETTINGS->{host};
}

sub trim {
	my $target = shift;
	return $target unless $target;
	$target =~ s/^(\s|　)*(.*)(\s|　)*$/$2/o;
	$target;
}

sub record_convert {
	my ($record, $column_names, $column_mapping, $table_name) = @_;
	my %ret;
	for my $column_name (@$column_names) {
		my $mapping = $column_mapping->{$column_name};
		unless (defined $mapping) {
			print STDERR "cannot find column $column_name\n";
			exit(1);
		};
		my $value = trim($record->{$column_name});
		# IDカラムが空
		if ($mapping->{id} && (not defined $value)) {
			last;
		}
		my $column_type_name = $mapping->{type};
		unless (defined $column_type_name) {
			print STDERR "column type is required for column $column_name\n";
			exit(1);
		}
		unless (exists $COLUMN_TYPE->{$column_type_name}) {
			print STDERR "cannot find column type $column_type_name\n";
			exit(1);
		}
		my $column_type = $COLUMN_TYPE->{$column_type_name};
		if (defined $value) {
			$value =~ s/,//g if ($column_type_name =~ /decimal/ || $column_type_name =~ /float/);
			if (exists $column_type->{regexp}) {
				unless ($value =~ /^$column_type->{regexp}$/) {
					unless (exists $column_type->{default}) {
						print STDERR "cannot match value '$value' with type $column_type_name ('$column_name') at $table_name\n";
						exit(1);
					}
				}
			} elsif (exists $column_type->{mapping}) {
				my $stored = $value;	  # storing data to output an error. 
				$value = $column_type->{mapping}->{$value};
				# 空でもないのにマッピングに存在しないものはエラー
				unless (defined $value) {
					if (exists $column_type->{default}) {
						$value = $column_type->{default};
					} else {
						print STDERR "cannot accept value undefined with type '$column_type_name' -> '$stored' ($table_name)\n";
						exit(1);
					}
				}
			}
		}
		if (exists $column_type->{filter}) {
			$value = &{$column_type->{filter}}($value, $record);
		}
		unless (defined $value) {
			if (exists $column_type->{default}) {
				$value = $column_type->{default};
			} elsif ($mapping->{required}) {
				print STDERR "cannot get value with type $column_type_name\n";
				exit(1);
			} else {
				# commented out the line below since we need to accept the value '0'. 
				# last;
			}
		}
		my $key = $column_name;
		$ret{$key} = $value;
	}

	my $flg = 1;
	map { $flg = $flg && (defined $_) } values %ret;
	if ($flg) {
		return \%ret;
	} else {
		return {};
	}
}

sub parse_books {
	my ($filenames, $through_filter) = @_;

	my $parsed_data = {};
	for my $filename (@$filenames) {
		my ($vol, $path, $file) = File::Spec->splitpath($filename);
		print $vol." ".$path." ".$file."\n";

		my $book = ExcelParser::parseFile(File::Spec->catpath($vol, $path, $file), 'sjis', 'utf8');

		unless (defined $book) {
			warn "Can't open Spreadsheet in file $file (@".File::Spec->catpath($vol,$path,$file)."\n";
			return undef;
		}

		for (my $i = 0; $i < scalar(@$SHEET_MAPPING); $i += 2) {
			my $sheet_name = $SHEET_MAPPING->[$i];

			my $sheet_mapping = $SHEET_MAPPING->[$i + 1];
			my $column_mapping_array = $sheet_mapping->{column_mapping};
			next if (!defined $column_mapping_array);

			my @column_names;
			for (my $i = 0; $i < @$column_mapping_array; $i++) {
				push(@column_names, $column_mapping_array->[$i]) if $i % 2 == 0;
			}
			my %column_mapping = @$column_mapping_array;

			my $sheet = $book->{$sheet_name};
			# print Dumper($book);		# when you want to check loaded data, you can see it by turning this comment off.
			my $table_name = $sheet_name;

			my @records;
	
			for my $record (@$sheet) {
				my $filtered_record;
				if ($through_filter) {
					$filtered_record = $record;
				} else {
					$filtered_record = record_convert($record, \@column_names, \%column_mapping, $table_name);
				}
				my $is_not_empty = 0;
				for my $key (keys %$filtered_record) {
					if ($filtered_record->{$key}) {
						$is_not_empty = 1;
						last;
					}
				}
				if ($is_not_empty && scalar(keys %$filtered_record) > 0) {
					push(@records, $filtered_record)
				}
			}

			unless ($parsed_data->{$table_name}) {
				$parsed_data->{$table_name} = \@records;
			} else {
				push @{$parsed_data->{$table_name}}, @records;
			}
		}
	}

	return $parsed_data;
}

sub get_master_version {
	my ($no_version, $no_insert) = @_;
	my $master_version;

	my $config = $dbh->get_database('gdHub')->get_collection('config');
	my $current_version = $config->find( { key => 'v' } );
	
	while (my $doc = $current_version->next) {
		print $doc->{value}."\n";
	}

	return $master_version;
}

sub xls2db {
	my ($filenames, $through_filter, $old_delete, $no_version, $no_insert, $check_db) = @_;

	# 全データ読み込み
	print "* Parse Excel.\n";
	# my $parsed_data = parse_books($filenames, $through_filter);

	# master_versionを振り出す
	print "* Get master version.\n";
	my $master_version = get_master_version($no_version, $no_insert);
	die unless defined $master_version;
	print "master version: $master_version\n";

}

sub main {
	my $argv = shift;

	my $old_delete = 0;
	my $get_snapshot = 0;
	my $through_filter = 0;
	my $no_version = 0;
	my $no_insert = 0;
	my $check_db = 0;

	GetOptionsFromArray($argv,
		'delete|d' => \$old_delete,
		'through|t' => \$through_filter,
		'snapshot|s' => \$get_snapshot,,
		'version|n' => \$no_version,
		'insert|i' => \$no_insert,
		'check|c' => \$check_db,
	) or pod2usage(2) and exit(1);

	if (scalar(@$argv) == 0) {
		pod2usage(2);
		exit(2);
	}

	if ($old_delete && !$no_insert) {
		if ($ENV{NODE_ENV} && $ENV{NODE_ENV} eq 'production') {
			die "This script cannnot execute in production";
		}
	}

	if ($get_snapshot) {
		print "== CREATE Excel file from database! ==\n";
		# db2xls($argv->[0]);
	} else {
		if ($check_db) {
			print "== Check master data ==\n";
		} elsif ($old_delete) {
			print "== INSERT new master and DELETE old master(s) ==\n";
		} else {
			print "== INSERT new master ==\n";
		}
		if ($check_db) {
			# is check mode
			$no_insert  = 1;
			$no_version = 1;
		}
		my @files = ($argv->[1]) if ($argv->[1]);
		push @files, $argv->[2] if ($argv->[2]);
		push @files, $argv->[3] if ($argv->[3]);
		xls2db(\@files, $through_filter, $old_delete, $no_version, $no_insert, $check_db);
	}
}

main(\@ARGV);

__END__

=head1 NAME

xls2db - Excel to BloodBrothers DB

=head1 SYNOPSIS

xls2db [database] [options] [file ...]

 Options:
   -d, --delete:   delete old version records.
   -t, --through:  through type filter(for using snapshot to db).
   -s, --snapshot: create Excel from DB.
   -v, --version: does not update version.
   -i, --insert: does not insert data.
   -c, --check: diff xls & db data.

=head1 OPTIONS

=over 8

=item B<-d, --delete>

Delete old version records.

=back

=head1 DESCRIPTION

Convert Excel master file to BloodBrothers master db.

=cut


