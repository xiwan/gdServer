package MongoConf;

use strict;
use warnings;

use MongoDB;
use MongoDB::OID;

use Parse::CPAN::Meta;

sub load_mongo_conf {
	my $path = shift;

	unless ($ENV{NODE_ENV}) {
		return undef;
	}

	my $conf = '';
	if ($ENV{NODE_ENV}) {
		$conf = $ENV{NODE_ENV} . '.js';
	}

	my $distmeta = Parse::CPAN::Meta->load_file('/Users/wanxi/Documents/dev/gdgame/gdserver/config/env/json/localhost_admin.json');
	print $distmeta->{ $distmeta->{default} }->{module} . "\n";
	
	# my $setting = load_json($path . $conf);

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


sub load_json {
	my $file = shift;

	open my $fh, '<', $file or die "$!";
	my $data = join '', <$fh>;
	close $fh;
	print $data;
	my $res = +{};

	while ($data =~ /host *: *'([\.\w]*)'/g) {
		$res->{host} = $1;
	}

	while ($data =~ /port *: *([\.\d]*)/g) {
		$res->{port} = $1;
	}

	while ($data =~ /user *: *'([\.\w]*)'/g) {
		$res->{user} = $1;
	}

	while ($data =~ /password *: *'([\.\w]*)'/g) {
		$res->{password} = $1;
	}

	unless ($res->{user}) {
		return undef;
	}

	print $res->{host}.' '.$res->{port}.' '.$res->{user}.' '.$res->{password}."\n";
}

sub main {
	my $CONFIG_PATH = "./config/env/";
	load_mongo_conf($CONFIG_PATH);
}


main();