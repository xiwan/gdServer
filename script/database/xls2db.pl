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

our $CONFIG_PATH = "./config/env/jsons/";

# 設定
our $SETTINGS = +{};

#########################

our $DB_SETTINGS = +{};
our $COLUMN_TYPE = $Conf::COLUMN_TYPE;
our $SHEET_MAPPING = $Conf::SHEET_MAPPING;

our $dbh;

sub load_mongo_conf {
	my $setting = MongoConf::load_mongo_conf($CONFIG_PATH, @ARGV);

	$SETTINGS->{database} = $setting;
	my $servers = $SETTINGS->{database}->{replSet}->{servers};

	$SETTINGS->{host} = 'mongodb://';
	for my $item (@$servers) {
		$SETTINGS->{host} .= $item->{host}.':'.$item->{port}.', ';
	}
	# print $SETTINGS->{host}."\n";

	$DB_SETTINGS = $SETTINGS->{database};

	$dbh = MongoDB::MongoClient->new(
		host => $SETTINGS->{host}, 
		find_master => 1, 
		username => $DB_SETTINGS->{user}, 
		password => $DB_SETTINGS->{password}, 
		db_name => $DB_SETTINGS->{database});
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
	my ($no_version) = @_;
	my $master_version = 0;

	my $masterVersion = $dbh->get_database($DB_SETTINGS->{database})->get_collection('masterversion');

	unless($no_version) {
		$masterVersion->update({},{'$inc' => { current => 1}});
	}

	my $current_version = $masterVersion->find();
	while (my $doc = $current_version->next) {
		$master_version = $doc->{current};
	}

	return $master_version;
}

sub insert_database {
	my ($table_name, $records, $version) = @_;

	my $collection = $dbh->get_database($DB_SETTINGS->{database})->get_collection($table_name);

	for my $r (@$records) {
		$r->{'version'} = $version;
		$collection->insert($r);
	}

}

sub delete_database {
	my ($table_name, $version) = @_;

	my $collection = $dbh->get_database($DB_SETTINGS->{database})->get_collection($table_name);

	$collection->remove({'version' => { '$lt' => $version}});
}

sub xls2db {
	my ($filenames, $no_delete, $through_filter, $no_version, $no_insert) = @_;

	# all data read
	print "* Parse Excel.\n";
	my $parsed_data = parse_books($filenames, $through_filter);

	# master_version retrieval
	print "* Get master version.\n";
	my $master_version = get_master_version($no_version);
	die unless defined $master_version;
	print "master version: $master_version\n";

	# テーブル毎INSERT/DELETE
	unless ($no_insert) {
		print "* Insert new records.\n";
		for my $table_name(keys %$parsed_data) {
			insert_database($table_name, $parsed_data->{$table_name}, $master_version);
		}
	}
	unless ($no_delete) {
		print "* Delete old records.\n";
		for my $table_name(keys %$parsed_data) {
			delete_database($table_name, $master_version);
		}
	}

	# commit チェック
	print "* FINISHED\n";

}

sub main {
	my $argv = shift;
	
	my $no_delete = 0;
	my $through_filter = 0;
	my $no_version = 0;
	my $no_insert = 0;

	GetOptionsFromArray($argv,
		'delete|d' => \$no_delete,
		'through|t' => \$through_filter,
		'version|v' => \$no_version,
		'insert|i' => \$no_insert,
	) or pod2usage(2) and exit(1);

	if (scalar(@$argv) == 0) {
		pod2usage(2);
		exit(2);
	}elsif (scalar(@$argv) == 1) {
		$no_version = 1;
	}

	load_mongo_conf($argv->[0]);

	my @files = ($argv->[1]) if ($argv->[1]);
	push @files, $argv->[2] if ($argv->[2]);
	push @files, $argv->[3] if ($argv->[3]);
	xls2db(\@files, $no_delete, $through_filter, $no_version, $no_insert);
}

main(\@ARGV);

__END__

=head1 NAME

xls2db - Excel to BloodBrothers DB

=head1 SYNOPSIS

xls2db [database] [options] [file ...]

 Options:
   -d, --delete:  keep old version records.
   -v, --version: does not update version.
   -i, --insert: 	does not insert data.

=head1 OPTIONS

=over 8

=item B<-d, --delete>

Delete old version records.

=back

=head1 DESCRIPTION

Convert Excel master file to BloodBrothers master db.

=cut


