package MongoConf;

use strict;
use warnings;
use Parse::CPAN::Meta;

sub load_mongo_conf {
	my $path = shift;
	my $confKey = shift;

	unless ($ENV{NODE_ENV}) {
		return undef;
	}

	unless ($confKey) {
		$confKey = 'default';
	}

	my $conf = '';
	if ($ENV{NODE_ENV}) {
		$conf = $ENV{NODE_ENV} . '.json';
	}

	my $setting = Parse::CPAN::Meta->load_file( $path . $conf);
	if ( $confKey eq 'default' ) {
		$confKey = $setting -> {$confKey};
	}

	my $found = 0;
	for my $item ( keys %$setting ) {
		if ( $item eq $confKey) {
			$found = 1;
		}
	}

	if (!$found) {
		die "not found a valid db.";
	}

	return $setting -> {$confKey};

	# my $client = MongoDB::MongoClient->new(
	# 	host => 'mongodb://localhost:27017, localhost:27018, localhost:27019', 
	# 	find_master => 1, 
	# 	username => 'root', 
	# 	password => '1q2w3e4R$', 
	# 	db_name =>'admin');

	# my $db = $client->get_database( 'gdHub' );
	# my $users = $db->get_collection( 'user' );
	# my $all_users = $users->find;
	# print "mongo\n";
	# while (my $doc = $all_users->next) {
	# 	print $doc->{'password'}."\n";
	# }
};

return 1;
