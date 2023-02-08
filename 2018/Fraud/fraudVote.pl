#!C:/strawberry/bin/perl.exe

use strict;
use warnings;

use String::Random;
use Data::Dump qw(dump);

use LWP::UserAgent;
use HTTP::Request::Common;

my %names = ();
my %usedNames = ();

my $boyCnt = 0;
my $girlCnt = 0;
my $lastCnt = 0;


getNameLists();


my @domains = ('gmail.com','yahoo.com','outlook.com','optimum.net');

open my $IN, '<', 'usedNames.txt';
my @lines = (<$IN>);
close $IN;

foreach my $line (@lines) {
  chomp($line);
  $usedNames{$line} = 1;
}


open my $OUT, '>>', 'usedNames.txt';

my $URLtoPostTo = "https://submit.jotform.us/submit/70786919749175/";


my $firstName = '';
my $lastName = '';

my $foo = new String::Random;
$foo->{'A'} = [ 'A'..'Z', 'a'..'z','0'..'9' ];

my $minimum = 60;
my $maximum = 90;

my $machineIP = '100.2.133.95';  #'68.197.119.27';  #

print qq[starting\n\n];

foreach my $i (2616 .. 7000) {

  my $ipAddress = $machineIP;

  while (defined($usedNames{"$firstName $lastName"}) && $usedNames{"$firstName $lastName"} == 1) {
    ($firstName,$lastName) = getName();
  }

  $usedNames{"$firstName $lastName"} = 1;

  next unless ($firstName && $lastName);


  print  qq[$i: $firstName $lastName\n];
  print $OUT qq[$firstName $lastName\n];
  
  my $domain = getDomain();
  my $email = "$firstName.$lastName\@$domain";

  my $randomString = $foo->randpattern("AAAAAAA");

  my %fields = (
	      q22_clickTo => 'No',
	      q23_email   => $email,
	      q2_nameoptional => "$firstName $lastName",
	      q69_clickTo69 => 'Will Blochinger',
	      simple_spc => '70786919749175-70786919749175',
	      formID => '70786919749175',
	      embedUrl => 'http://www.njherald.com/readerschoice',
	      event_id => '1491492966136_70786919749175_'.$randomString,
	     );



  while ($ipAddress eq $machineIP) {
    sleep(5);
    $ipAddress = getIPAddress();

    print qq[\tIP:  $ipAddress\n];
  }

  my $Browser = LWP::UserAgent->new(ssl_opts => { verify_hostname => 1});

  my $userAgent = getUserAgent();

  $Browser->agent($userAgent);


  my $Page = $Browser->request(POST $URLtoPostTo,\%fields);

  if ($Page->is_success) {
    #print $Page->content;
  }
  else {
    print $Page->message;
  }


  print qq[\n\n\n=====================\n\n\n];


  my $interval = 65; #$minimum + int(rand($maximum - $minimum));
  print qq[\t waiting: $interval\n\n];
  sleep($interval);
}

sub getIPAddress {
  return `curl ipecho.net/plain`;
}

sub getUserAgent {

  my @uAs = ('Generic Win10','Generic Win7','Generic MacOSX','Safari Generic MacOSX','Firefox Generic Win10','IE 11.0 for Desktop Win7','Chrome Generic Win8.1');

  my %uA = (
	    'Chrome Generic Win10' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	    'Chrome Generic Win7' => 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	    'Chrome Generic MacOSX' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	    'Safari Generic MacOSX' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8',
	    'Firefox Generic Win10' => 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0',
	    'IE 11.0 for Desktop Win7' => 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
	    'Chrome Generic Win8.1' => 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
	   );
  
  my $userAgent = $uA{$uAs[int(rand(@uAs))]};
  return $userAgent;
}

sub getDomain {
  return $domains[int(rand(4))];
}


sub getName {

  my $firstName = $names{boyNames}[int(rand($boyCnt))];
  if (int(rand(100))+1 > 50) {
    $firstName = $names{girlNames}[int(rand($girlCnt))];
  }

  my $lastName = $names{lastNames}[int(rand($lastCnt))];

  return ($firstName,$lastName);
}

sub getNameLists {
  my $lastNamesList = 'Smith,Johnson,Williams,Brown,Jones,Miller,Davis,Garcia,Rodriguez,Wilson,Martinez,Anderson,Taylor,Thomas,Hernandez,Moore,Martin,Jackson,Thompson,White,Lopez,Lee,Gonzalez,Harris,Clark,Lewis,Robinson,Walker,Perez,Hall,Young,Allen,Sanchez,Wright,King,Scott,Green,Baker,Adams,Nelson,Hill,Ramirez,Campbell,Mitchell,Roberts,Carter,Phillips,Evans,Turner,Torres,Parker,Collins,Edwards,Stewart,Flores,Morris,Nguyen,Murphy,Rivera,Cook,Rogers,Morgan,Peterson,Cooper,Reed,Bailey,Bell,Gomez,Kelly,Howard,Ward,Cox,Diaz,Richardson,Wood,Watson,Brooks,Bennett,Gray,James,Reyes,Cruz,Hughes,Price,Myers,Long,Foster,Sanders,Ross,Morales,Powell,Sullivan,Russell,Ortiz,Jenkins,Gutierrez,Perry,Butler,Barnes,Fisher,Henderson,Coleman,Simmons,Patterson,Jordan,Reynolds,Hamilton,Graham,Kim,Gonzales,Alexander,Ramos,WaLlace,Griffin,West,Cole,Hayes,Chavez,Gibson,Bryant,Ellis,Stevens,Murray,Ford,Marshall,Owens,Mcdonald,Harrison,Ruiz,Kennedy,Wells,Alvarez,Woods,Mendoza,Castillo,Olson,Webb,Washington,Tucker,Freeman,Burns,Vasquez,Snyder,Simpson,Crawford,Jimenez,Porter,Mason,Shaw,Gordon,Wagner,Hunter,Romero,Hicks,Dixon,Hunt,Palmer,Robertson,Black,Holmes,Stone,Meyer,Boyd,Mills,Warren,Fox,Rose,Rice,Moreno,Schmidt,Patel,Ferguson,Nichols,Herrera,Medina,Ryan,Fernandez,Weaver,Daniels,Stephens,Gardner,Payne,Kelley,Dunn,Pierce,Arnold,Tran,Spencer,Peters,Hawkins,Grant,Hansen,Castro,Hoffman,Hart,Elliott,Cunningham,Knight,Bradley,Carroll,Hudson,Duncan,Armstrong,Berry,Andrews,Johnston,Ray,Lane,Riley,Carpenter,Perkins,Aguilar,Silva,Richards,Willis,Matthews,Chapman,Lawrence,Garza,Vargas,Watkins,Wheeler,Larson,Carlson,Harper,George,Greene,Burke,Guzman,Morrison,Munoz,Jacobs,Obrien,Lawson,Franklin,Lynch,Bishop,Carr,Salazar,Austin,Mendez,Gilbert,Jensen,Williamson,Montgomery,Harvey,Oliver,Howell,Dean,Hanson,Weber,Garrett,Sims,Burton,Fuller,Soto,Mccoy,Welch,Chen,Schultz,Walters,Reid,Fields,Walsh,Little,Fowler,Bowman,Davidson,May,Day,Schneider,Newman,Brewer,Lucas,Holland,Wong,Banks,Santos,Curtis,Pearson,Delgado,Valdez,Pena,Rios,Douglas,Sandoval,Barrett,Hopkins,Keller,Guerrero,Stanley,Bates,Alvarado,Beck,Ortega,Wade,Estrada,Contreras,Barnett,Caldwell,Santiago,Lambert,Powers,Chambers,Nunez,Craig,Leonard,Lowe,Rhodes,Byrd,Gregory,Shelton,Frazier,Becker,Maldonado,Fleming,Vega,Sutton,Cohen,Jennings,Parks,Mcdaniel,Watts,Barker,Norris,Vaughn,Vazquez,Holt,Schwartz,Steele,Benson,Neal,Dominguez,Horton,Terry,Wolfe,Hale,Lyons,Graves,Haynes,Miles,Park,Warner,Padilla,Bush,Thornton,Mccarthy,Mann,Zimmerman,Erickson,Fletcher,Mckinney,Page,Dawson,Joseph,Marquez,Reeves,Klein,Espinoza,Baldwin,Moran,Love,Robbins,Higgins,Ball,Cortez,Le,Griffith,Bowen,Sharp,Cummings,Ramsey,Hardy,Swanson,Barber,Acosta,Luna,Chandler,Daniel,Blair,Cross,Simon,Dennis,Oconnor,Quinn,Gross,Navarro,Moss,Fitzgerald,Doyle,Mclaughlin,Rojas,Rodgers,Stevenson,Singh,Yang,Figueroa,Harmon,Newton,Paul,Manning,Garner,Mcgee,Reese,Francis,Burgess,Adkins,Goodman,Curry,Brady,Christensen,Potter,Walton,Goodwin,Mullins,Molina,Webster,Fischer,Campos,Avila,Sherman,Todd,Chang,Blake,Malone,Wolf,Hodges,Juarez,Gill,Farmer,Hines,Gallagher,Duran,Hubbard,Cannon,Miranda,Wang,Saunders,Tate,Mack,Hammond,Carrillo,Townsend,Wise,Ingram,Barton,Mejia,Ayala,Schroeder,Hampton,Rowe,Parsons,Frank,Waters,Strickland,Osborne,Maxwell,Chan,Deleon,Norman,Harrington,Casey,Patton,Logan,Bowers,Mueller,Glover,Floyd,Hartman,Buchanan,Cobb,French,Kramer,Mccormick,Clarke,Tyler,Gibbs,Moody,Conner,Sparks,Mcguire,Leon,Bauer,Norton,Pope,Flynn,Hogan,Robles,Salinas,Yates,Lindsey,Lloyd,Marsh,Mcbride,Owen,Solis,Pham,Lang,Pratt,Lara,Brock,Ballard,Trujillo,Shaffer,Drake,Roman,Aguirre,Morton,Stokes,Lamb,Pacheco,Patrick,Cochran,Shepherd,Cain,Burnett,Hess,Li,Cervantes,Olsen,Briggs,Ochoa,Cabrera,Velasquez,Montoya,Roth,Meyers,Cardenas,Fuentes,Weiss,Wilkins,Hoover,Nicholson,Underwood,Short,Carson,Morrow,Colon,Holloway,Summers,Bryan,Petersen,Mckenzie,Serrano,Wilcox,Carey,Clayton,Poole,Calderon,Gallegos,Greer,Rivas,Guerra,Decker,Collier,Wall,Whitaker,Bass,Flowers,Davenport,Conley,Houston,Huff,Copeland,Hood,Monroe,Massey,Roberson,Combs,Franco,Larsen,Pittman,Randall,Skinner,Wilkinson,Kirby,Cameron,Bridges,Anthony,Richard,Kirk,Bruce,Singleton,Mathis,Bradford,Boone,Abbott,Charles,Allison,Sweeney,Atkinson,Horn,Jefferson,Rosales,York,Christian,Phelps,Farrell,Castaneda,Nash,Dickerson,Bond,Wyatt,Foley,Chase,Gates,Vincent,Mathews,Hodge,Garrison,Trevino,Villarreal,Heath,Dalton,Valencia,Callahan,Hensley,Atkins,Huffman,Roy,Boyer,Shields,Lin,Hancock,Grimes,Glenn,Cline,Delacruz,Camacho,Dillon,Parrish,Oneill,Melton,Booth,Kane,Berg,Harrell,Pitts,Savage,Wiggins,Brennan,Salas,Marks,Russo,Sawyer,Baxter,Golden,Hutchinson,Liu,Walter,Mcdowell,Wiley,Rich,Humphrey,Johns,Koch,Suarez,Hobbs,Beard,Gilmore,Ibarra,Keith,Macias,Khan,Andrade,Ware,Stephenson,Henson,Wilkerson,Dyer,Mcclure,Blackwell,Mercado,Tanner,Eaton,Clay,Barron,Beasley,Oneal,Small,Preston,Wu,Zamora,MacDonald,Vance,Snow,Mcclain,Stafford,Orozco,Barry,English,Shannon,Kline,Jacobson,Woodard,Huang,Kemp,Mosley,Prince,Merritt,Hurst,Villanueva,Roach,Nolan,Lam,Yoder,Mccullough,Lester,Santana,Valenzuela,Winters,Barrera,Orr,Leach,Berger,Mckee,Strong,Conway,Stein,Whitehead,Bullock,Escobar,Knox,Meadows,Solomon,Velez,ODonnell,Kerr,Stout,Blankenship,Browning,Kent,Lozano,Bartlett,Pruitt,Buck,Barr,Gaines,Durham,Gentry,Mcintyre,Sloan,Rocha,Melendez,Herman,Sexton,Moon,Hendricks,Rangel,Stark,Lowery,Hardin,Hull,Sellers,Ellison,Calhoun,Gillespie,Mora,Knapp,Mccall,Morse,Dorsey,Weeks,Nielsen,Livingston,Leblanc,Mclean,Bradshaw,Glass,Middleton,Buckley,Schaefer,Frost,Howe,House,Mcintosh,Ho,Pennington,Reilly,Hebert,Mcfarland,Hickman,Noble,Spears,Conrad,Arias,Galvan,Velazquez,Huynh,Frederick,Randolph,Cantu,Fitzpatrick,Mahoney,Peck,Villa,Michael,Donovan,Mcconnell,Walls,Boyle,Mayer,Zuniga,Giles,Pineda,Pace,Hurley,Mays,Mcmillan,Crosby,Ayers,Case,Bentley,Shepard,Everett,Pugh,David,Mcmahon,Dunlap,Bender,Hahn,Harding,Acevedo,Raymond,Blackburn,Duffy,Landry,Dougherty,Bautista,Shah,Potts,Arroyo,Valentine,Meza,Gould,Vaughan,Fry,Rush,Avery,Herring,Dodson,Clements,Sampson,Tapia,Bean,Lynn,Crane,Farley,Cisneros,Benton,Ashley,Mckay,Finley,Best,Blevins,Friedman,Moses,Sosa,Blanchard,Huber,Frye,Krueger,Bernard,Rosario,Rubio,Mullen,Benjamin,Haley,Chung,Moyer,Choi,Horne,Yu,Woodward,Ali,Nixon,Hayden,Rivers,Estes,Mccarty,Richmond,Stuart,Maynard,Brandt,OConnell,Hanna,Sanford,Sheppard,Church,Burch,Levy,Rasmussen,Coffey,Ponce,Faulkner,Donaldson,Schmitt,Novak,Costa,Montes,Booker,Cordova,Waller,Arellano,Maddox,Mata,Bonilla,Stanton,Compton,Kaufman,Dudley,Mcpherson,Beltran,Dickson,Mccann,Villegas,Proctor,Hester,Cantrell,Daugherty,Cherry,Bray,Davila,Rowland,Madden,Levine,Spence,Good,Irwin,Werner,Krause,Petty,Whitney,Baird,Hooper,Pollard,Zavala,Jarvis,Holden,Hendrix,Haas,Mcgrath,Bird,Lucero,Terrell,Riggs,Joyce,Rollins,Mercer,Galloway,Duke,Odom,Andersen,Downs,Hatfield,Benitez,Archer,Huerta,Travis,Mcneil,Hinton,Zhang,Hays,Mayo,Fritz,Branch,Mooney,Ewing,Ritter,Esparza,Frey,Braun,Gay,Riddle,Haney,Kaiser,Holder,Chaney,Mcknight,Gamble,Vang,Cooley,Carney,Cowan,Forbes,Ferrell,Davies,Barajas,Shea,Osborn,Bright,Cuevas,Bolton,Murillo,Lutz,Duarte,Kidd,Key,Cooke';



  my $boyNames = 'James,John,Robert,Michael,William,David,Richard,Charles,Joseph,Thomas,Christopher,Daniel,Paul,Mark,Donald,George,Kenneth,Steven,Edward,Brian,Ronald,Anthony,Kevin,Jason,Matthew,Gary,Timothy,Jose,Larry,Jeffrey,Frank,Scott,Eric,Stephen,Andrew,Raymond,Gregory,Joshua,Jerry,Dennis,Walter,Patrick,Peter,Harold,Douglas,Henry,Carl,Arthur,Ryan,Roger,Joe,Juan,Jack,Albert,Jonathan,Justin,Terry,Gerald,Keith,Samuel,Willie,Ralph,Lawrence,Nicholas,Roy,Benjamin,Bruce,Brandon,Adam,Harry,Fred,Wayne,Billy,Steve,Louis,Jeremy,Aaron,Randy,Howard,Eugene,Carlos,Russell,Bobby,Victor,Martin,Ernest,Phillip,Todd,Jesse,Craig,Alan,Shawn,Clarence,Sean,Philip,Chris,Johnny,Earl,Jimmy,Antonio,Danny,Bryan,Tony,Luis,Mike,Stanley,Leonard,Nathan,Dale,Manuel,Rodney,Curtis,Norman,Allen,Marvin,Vincent,Glenn,Jeffery,Travis,Jeff,Chad,Jacob,Lee,Melvin,Alfred,Kyle,Francis,Bradley,Jesus,Herbert,Frederick,Ray,Joel,Edwin,Don,Eddie,Ricky,Troy,Randall,Barry,Alexander,Bernard,Mario,Leroy,Francisco,Marcus,Micheal,Theodore,Clifford,Miguel,Oscar,Jay,Jim,Tom,Calvin,Alex,Jon,Ronnie,Bill,Lloyd,Tommy,Leon,Derek,Warren,Darrell,Jerome,Floyd,Leo,Alvin,Tim,Wesley,Gordon,Dean,Greg,Jorge,Dustin,Pedro,Derrick,Dan,Lewis,Zachary,Corey,Herman,Maurice,Vernon,Roberto,Clyde,Glen,Hector,Shane,Ricardo,Sam,Rick,Lester,Brent,Ramon,Charlie,Tyler,Gilbert,Gene,Marc,Reginald,Ruben,Brett,Angel,Nathaniel,Rafael,Leslie,Edgar,Milton,Raul,Ben,Chester,Cecil,Duane,Franklin,Andre,Elmer,Brad,Gabriel,Ron,Mitchell,Roland,Arnold,Harvey,Jared,Adrian,Karl,Cory,Claude,Erik,Darryl,Jamie,Neil,Jessie,Christian,Javier,Fernando,Clinton,Ted,Mathew,Tyrone,Darren,Lonnie,Lance,Cody,Julio,Kelly,Kurt,Allan,Nelson,Guy,Clayton,Hugh,Max,Dwayne,Dwight,Armando,Felix,Jimmie,Everett,Jordan,Ian,Wallace,Ken,Bob,Jaime,Casey,Alfredo,Alberto,Dave,Ivan,Johnnie,Sidney,Byron,Julian,Isaac,Morris,Clifton,Willard,Daryl,Ross,Virgil,Andy,Marshall,Salvador,Perry,Kirk,Sergio,Marion,Tracy,Seth,Kent,Terrance,Rene,Eduardo,Terrence,Enrique,Freddie,Wade,Austin,Stuart,Fredrick,Arturo,Alejandro,Jackie,Joey,Nick,Luther,Wendell,Jeremiah,Evan,Julius,Dana,Donnie,Otis,Shannon,Trevor,Oliver,Luke,Homer,Gerard,Doug,Kenny,Hubert,Angelo,Shaun,Lyle,Matt,Lynn,Alfonso,Orlando,Rex,Carlton,Ernesto,Cameron,Neal,Pablo,Lorenzo,Omar,Wilbur,Blake,Grant,Horace,Roderick,Kerry,Abraham,Willis,Rickey,Jean,Ira,Andres,Cesar,Johnathan,Malcolm,Rudolph,Damon,Kelvin,Rudy,Preston,Alton,Archie,Marco,Wm,Pete,Randolph,Garry,Geoffrey,Jonathon,Felipe,Bennie,Gerardo,Ed,Dominic,Robin,Loren,Delbert,Colin,Guillermo,Earnest,Lucas,Benny,Noel,Spencer,Rodolfo,Myron,Edmund,Garrett,Salvatore,Cedric,Lowell,Gregg,Sherman,Wilson,Devin,Sylvester,Kim,Roosevelt,Israel,Jermaine,Forrest,Wilbert,Leland,Simon,Guadalupe,Clark,Irving,Carroll,Bryant,Owen,Rufus,Woodrow,Sammy,Kristopher,Mack,Levi,Marcos,Gustavo,Jake,Lionel,Marty,Taylor,Ellis,Dallas,Gilberto,Clint,Nicolas,Laurence,Ismael,Orville,Drew,Jody,Ervin,Dewey,Al,Wilfred,Josh,Hugo,Ignacio,Caleb,Tomas,Sheldon,Erick,Frankie,Stewart,Doyle,Darrel,Rogelio,Terence,Santiago,Alonzo,Elias,Bert,Elbert,Ramiro,Conrad,Pat,Noah,Grady,Phil,Cornelius,Lamar,Rolando,Clay,Percy,Dexter,Bradford,Merle,Darin,Amos,Terrell,Moses,Irvin,Saul,Roman,Darnell,Randal,Tommie,Timmy,Darrin,Winston,Brendan,Toby,Van,Abel,Dominick,Boyd,Courtney,Jan,Emilio,Elijah,Cary,Domingo,Santos,Aubrey,Emmett,Marlon,Emanuel,Jerald,Edmond,Emil,Dewayne,Will,Otto,Teddy,Reynaldo,Bret,Morgan,Jess,Trent,Humberto,Emmanuel,Stephan,Louie,Vicente,Lamont,Stacy,Garland,Miles,Micah,Efrain,Billie,Logan,Heath,Rodger,Harley,Demetrius,Ethan,Eldon,Rocky,Pierre,Junior,Freddy,Eli,Bryce,Antoine,Robbie,Kendall,Royce,Sterling,Mickey,Chase,Grover,Elton,Cleveland,Dylan,Chuck,Damian,Reuben,Stan,August,Leonardo,Jasper,Russel,Erwin,Benito,Hans,Monte,Blaine,Ernie,Curt,Quentin,Agustin,Murray,Jamal,Devon,Adolfo,Harrison,Tyson,Burton,Brady,Elliott,Wilfredo,Bart,Jarrod,Vance,Denis,Damien,Joaquin,Harlan,Desmond,Elliot,Darwin,Ashley,Gregorio,Buddy,Xavier,Kermit,Roscoe,Esteban,Anton,Solomon,Scotty,Norbert,Elvin,Williams,Nolan,Carey,Rod,Quinton';

  my $girlNames = 'Mary,Patricia,Linda,Barbara,Elizabeth,Jennifer,Maria,Susan,Margaret,Dorothy,Lisa,Nancy,Karen,Betty,Helen,Sandra,Donna,Carol,Ruth,Sharon,Michelle,Laura,Sarah,Kimberly,Deborah,Jessica,Shirley,Cynthia,Angela,Melissa,Brenda,Amy,Anna,Rebecca,Virginia,Kathleen,Pamela,Martha,Debra,Amanda,Stephanie,Carolyn,Christine,Marie,Janet,Catherine,Frances,Ann,Joyce,Diane,Alice,Julie,Heather,Teresa,Doris,Gloria,Evelyn,Jean,Cheryl,Mildred,Katherine,Joan,Ashley,Judith,Rose,Janice,Kelly,Nicole,Judy,Christina,Kathy,Theresa,Beverly,Denise,Tammy,Irene,Jane,Lori,Rachel,Marilyn,Andrea,Kathryn,Louise,Sara,Anne,Jacqueline,Wanda,Bonnie,Julia,Ruby,Lois,Tina,Phyllis,Norma,Paula,Diana,Annie,Lillian,Emily,Robin,Peggy,Crystal,Gladys,Rita,Dawn,Connie,Florence,Tracy,Edna,Tiffany,Carmen,Rosa,Cindy,Grace,Wendy,Victoria,Edith,Kim,Sherry,Sylvia,Josephine,Thelma,Shannon,Sheila,Ethel,Ellen,Elaine,Marjorie,Carrie,Charlotte,Monica,Esther,Pauline,Emma,Juanita,Anita,Rhonda,Hazel,Amber,Eva,Debbie,April,Leslie,Clara,Lucille,Jamie,Joanne,Eleanor,Valerie,Danielle,Megan,Alicia,Suzanne,Michele,Gail,Bertha,Darlene,Veronica,Jill,Erin,Geraldine,Lauren,Cathy,Joann,Lorraine,Lynn,Sally,Regina,Erica,Beatrice,Dolores,Bernice,Audrey,Yvonne,Annette,June,Samantha,Marion,Dana,Stacy,Ana,Renee,Ida,Vivian,Roberta,Holly,Brittany,Melanie,Loretta,Yolanda,Jeanette,Laurie,Katie,Kristen,Vanessa,Alma,Sue,Elsie,Beth,Jeanne,Vicki,Carla,Tara,Rosemary,Eileen,Terri,Gertrude,Lucy,Tonya,Ella,Stacey,Wilma,Gina,Kristin,Jessie,Natalie,Agnes,Vera,Willie,Charlene,Bessie,Delores,Melinda,Pearl,Arlene,Maureen,Colleen,Allison,Tamara,Joy,Georgia,Constance,Lillie,Claudia,Jackie,Marcia,Tanya,Nellie,Minnie,Marlene,Heidi,Glenda,Lydia,Viola,Courtney,Marian,Stella,Caroline,Dora,Jo,Vickie,Mattie,Terry,Maxine,Irma,Mabel,Marsha,Myrtle,Lena,Christy,Deanna,Patsy,Hilda,Gwendolyn,Jennie,Nora,Margie,Nina,Cassandra,Leah,Penny,Kay,Priscilla,Naomi,Carole,Brandy,Olga,Billie,Dianne,Tracey,Leona,Jenny,Felicia,Sonia,Miriam,Velma,Becky,Bobbie,Violet,Kristina,Toni,Misty,Mae,Shelly,Daisy,Ramona,Sherri,Erika,Katrina,Claire,Lindsey,Lindsay,Geneva,Guadalupe,Belinda,Margarita,Sheryl,Cora,Faye,Ada,Natasha,Sabrina,Isabel,Marguerite,Hattie,Harriet,Molly,Cecilia,Kristi,Brandi,Blanche,Sandy,Rosie,Joanna,Iris,Eunice,Angie,Inez,Lynda,Madeline,Amelia,Alberta,Genevieve,Monique,Jodi,Janie,Maggie,Kayla,Sonya,Jan,Lee,Kristine,Candace,Fannie,Maryann,Opal,Alison,Yvette,Melody,Luz,Susie,Olivia,Flora,Shelley,Kristy,Mamie,Lula,Lola,Verna,Beulah,Antoinette,Candice,Juana,Jeannette,Pam,Kelli,Hannah,Whitney,Bridget,Karla,Celia,Latoya,Patty,Shelia,Gayle,Della,Vicky,Lynne,Sheri,Marianne,Kara,Jacquelyn,Erma,Blanca,Myra,Leticia,Pat,Krista,Roxanne,Angelica,Johnnie,Robyn,Francis,Adrienne,Rosalie,Alexandra,Brooke,Bethany,Sadie,Bernadette,Traci,Jody,Kendra,Jasmine,Nichole,Rachael,Chelsea,Mable,Ernestine,Muriel,Marcella,Elena,Krystal,Angelina,Nadine,Kari,Estelle,Dianna,Paulette,Lora,Mona,Doreen,Rosemarie,Angel,Desiree,Antonia,Hope,Ginger,Janis,Betsy,Christie,Freda,Mercedes,Meredith,Lynette,Teri,Cristina,Eula,Leigh,Megan,Sophia,Eloise,Rochelle,Gretchen,Cecelia,Raquel,Henrietta,Alyssa,Jana,Kelley,Gwen,Kerry,Jenna,Tricia,Laverne,Olive,Alexis,Tasha,Silvia,Elvira,Casey,Delia,Sophie,Kate,Patti,Lorena,Kellie,Sonja,Lila,Lana,Darla,May,Mindy,Essie,Mandy,Lorene,Elsa,Josefina,Jeannie,Miranda,Dixie,Lucia,Marta,Faith,Lela,Johanna,Shari,Camille,Tami,Shawna,Elisa,Ebony,Melba,Ora,Nettie,Tabitha,Ollie,Jaime,Winifred,Kristie,Marina,Alisha,Aimee,Rena,Myrna,Marla,Tammie,Latasha,Bonita,Patrice,Ronda,Sherrie,Addie,Francine,Deloris,Stacie,Adriana,Cheri,Shelby,Abigail,Celeste,Jewel,Cara,Adele,Rebekah,Lucinda,Dorthy,Chris,Effie,Trina,Reba,Shawn,Sallie,Aurora,Lenora,Etta,Lottie,Kerri,Trisha,Nikki,Estella,Francisca,Josie,Tracie,Marissa,Karin,Brittney,Janelle,Lourdes,Laurel,Helene,Fern,Elva,Corinne,Kelsey,Ina,Bettie,Elisabeth,Aida,Caitlin,Ingrid,Iva,Eugenia,Christa,Goldie,Cassie,Maude,Jenifer,Therese,Frankie,Dena,Lorna,Janette,Latonya,Candy,Morgan,Consuelo,Tamika,Rosetta,Debora,Cherie,Polly,Dina,Jewell,Fay,Jillian,Dorothea,Nell,Trudy,Esperanza,Patrica,Kimberley,Shanna,Helena,Carolina,Cleo,Stefanie,Rosario,Ola,Janine';


  @{$names{lastNames}} = split/,/,$lastNamesList;
  @{$names{boyNames}} = split/,/,$boyNames;
  @{$names{girlNames}} = split/,/,$girlNames;


  $boyCnt = @{$names{boyNames}};
  $girlCnt = @{$names{girlNames}};
  $lastCnt = @{$names{lastNames}};



}

