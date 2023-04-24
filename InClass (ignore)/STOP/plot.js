// create an array to hold the agency names
var agencyNames = ['Beaverton PD', 'Clackamas CO SO', 'Eugene PD', 'Gresham PD', 'Hillsboro PD', 'Marion CO SO', 
                    'Medford PD', 'Multnomah CO SO', 'Oregon State Police', 'Portland PB', 'Salem PD', 'Washington CO SO'];

// create an array to hold the number of stops for each racial/ethnic group for each agency
var asianPI = [724, 721, 278, 94, 365, 421, 55, 236, 3316, 674, 123, 1304];
var black = [1156, 958, 758, 312, 366, 401, 154, 762, 4129, 2324, 191, 1163];
var latinx = [2466, 2354, 919, 450, 1748, 2616, 696, 1016, 18006, 1564, 1272, 5000];
var middleEastern = [341, 252, 0, 30, 160, 146, 17, 94, 1669, 186, 29, 618];
var nativeAmerican = [54, 178, 0, 7, 25, 12, 5, 27, 746, 74, 22, 136];
var white = [8265, 13552, 9609, 1358, 3698, 10142, 3284, 4464, 100782, 8611, 3123, 12578];
var total = [13006, 18015, 11564, 2251, 6362, 13738, 4211, 6599, 128648, 13433, 4760, 20799];

// create a trace for each racial/ethnic group
var trace1 = {
  x: agencyNames,
  y: asianPI,
  mode: 'lines+markers',
  name: 'Asian/PI'
};

var trace2 = {
  x: agencyNames,
  y: black,
  mode: 'lines+markers',
  name: 'Black'
};

var trace3 = {
  x: agencyNames,
  y: latinx,
  mode: 'lines+markers',
  name: 'Latinx'
};

var trace4 = {
  x: agencyNames,
  y: middleEastern,
  mode: 'lines+markers',
  name: 'Middle Eastern'
};

var trace5 = {
  x: agencyNames,
  y: nativeAmerican,
  mode: 'lines+markers',
  name: 'Native American'
};

var trace6 = {
  x: agencyNames,
  y: white
}