package MongoConf;

use strict;
use warnings;
use Data::Dumper;
use Parse::CPAN::Meta;

sub load_mongo_conf {
	my $path = shift;
	my $confKey = shift;

	unless ($ENV{NODE_ENV}) {
		return undef;
	}

	unless ($confKey) {
		$confKey = "mongo_gdHub";
	}

	my $conf = '';
	if ($ENV{NODE_ENV}) {
		$conf = $ENV{NODE_ENV} . '.json';
	}

	my $setting = Parse::CPAN::Meta->load_file( $path . $conf );
	
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

};

return 1;
