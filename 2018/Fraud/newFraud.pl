#!/Users/dennisluken/perl5/perlbrew/perls/perl-5.16.0/bin/perl



#    cd /Users/dennisluken/Dropbox/Projects/WBP/2018/Fraud
use strict;
use warnings;

use Data::Dumper;

use LWP;

$| = 1;

my $user_agent = new LWP::UserAgent();



# <iframe allowfullscreen="" data-ss-embed="iframe" scrolling="no" src="https://embed-468223.secondstreetapp.com/embed/499200d1-33cc-4451-82a3-8c59bf7c5b27/gallery/?category=1507521" style="background-color: transparent; border: 0px none transparent; padding: 0px; overflow: hidden; min-width: 100%; width: 100px; height: 3381px;"></iframe>

my $url = 'https://embed-468223.secondstreetapp.com/embed/499200d1-33cc-4451-82a3-8c59bf7c5b27/gallery/?category=1507521';

my $page = get_page($url);

print $page;


sub get_page {
  my $url = shift;
  my $request;
  my $page;
  if ($request = $user_agent->request(HTTP::Request->new("GET","$url"))) {
    if ($request->is_success) {
      $page = $request->content;
    } else {
      print "page error: $url\n";
    }
  } else {
    print "request error: $url\n";
  }
  return $page;
}


