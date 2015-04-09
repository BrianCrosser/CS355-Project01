// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : '',
        password : ''
    });
    
var app = module.exports = express.createServer();

// Database setup

connection.query('USE bcrosser', function (err) {
    if (err) throw err;
});

// Configuration

app.use(express.bodyParser());

// Main page with two links to view the table and drop down menu

var htmlHeader = '<html><head><title>The Loop</title></head><body>';
var htmlFooter = '</body></html>';

function handleError(res, error) {
    console.log(error);
    res.send(error.toString());
}

function buildUserViewUser(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Profile Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>First Name: ' + result[i].FirstName + '</li>' +
            '<li>Last Name: ' + result[i].LastName + '</li>' +
            '<li>Email: ' + result[i].Email + '</li></ul>'
    }
	responseHTML += '<br><hr>' + '</br></hr>';
	
	responseHTML += htmlFooter;

    return responseHTML;
}


function buildUserViewMovie(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Movie Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>Movie Title: ' + result[i].MovieName + '</li>' +
            '<li>Year Released: ' + result[i].YearReleased + '</li>' +
            '<li>Rating: ' + result[i].Rating + '</li>' +
            '<li>Genre: ' + result[i].Genre + '</li></ul>' 
    }
    responseHTML += htmlFooter;

    return responseHTML;
}

function buildUserViewTV(result) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>TV Show Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>TV Show Name: ' + result[i].ShowName + '</li>' +
            '<li>Seasons: ' + result[i].Seasons + '</li>' +
            '<li>Rating: ' + result[i].Rating + '</li>' +
            '<li>Genre: ' + result[i].Genre + '</li>' +
			'<li>Air Time: ' + result[i].AirTime + '</li></ul>' 
    }
    responseHTML += htmlFooter;

    return responseHTML;
}

app.get('/', function(req, res) {
    req.query.name
    res.send('<html><head><title>The Loop</title></head><body>' +
                 '<a href="/profile/view/table">View Profile HTML Table</a>' +
                 '<br />' +
                 '<a href="/profile/add"> Insert New Profile</a>' +
                 '<br />' +
                 '<br>' +
                 '<a href="/movie/view/table">View Movie HTML Table</a>' +
                 '<br />' +
                 '<a href="/movie/add"> Insert New Movie</a>' +
                 '<br />' +
                 '<br>' +
                 '<a href="/tv/view/table">View TV HTML Table</a>' +
                 '<br />' +
                 '<a href="/tv/add"> Insert New TV Show</a>' +
                 '<br />' +
				 '</body></html>'
    );
});

// HTML Example with data populated from the Student table

app.get('/profile/view/table', function (req, res) {
  
  var myQry = 'SELECT * FROM Profile';
  
  console.log(myQry);
  
  connection.query(myQry,  
        function (err, result) {
            if (err) {
              handleError(res, err);
            }
            else 
			{
              // Build the HTML table from the data in the Student table
              var responseHTML = '<h1>Profile Table</h1>'; 
              responseHTML += '<table border=1>';
              responseHTML = responseHTML + '<tr><th>First Name</th><th>Last Name</th><th><!-- More Info Column --></th><th><!-- Edit Info Column --></th><th><!-- Delete Info Column --></th></tr>';
              
              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<td>' + result[i].FirstName + '</td>' +
                    '<td>' + result[i].LastName + '</td>' +
                    '<td><a href="/profile/?UserID=' + result[i].UserID + '">more info</a>' +
                    '<td><a href="/profile/edit?UserID=' + result[i].UserID + '">edit</a>' +
                    '<td><a href="/profile/delete?UserID=' + result[i].UserID + '">delete</a>' +
                    '</tr>'
              }

              responseHTML += '</table>';
			  responseHTML += '<br></br>' + '<a href="/">Back </a>';
              res.send(responseHTML);
            		
			}
        }
    );
});

// Display information about a Student when given their Student_number
app.get('/profile/', function (req, res) 
{
	var myQry = 'SELECT * FROM Profile WHERE UserID=' + req.query.UserID;
	console.log(myQry);
    connection.query(myQry, function (err, result) 
	{
		if (err) 
		{
			handleError(res, err);
        }
        else 
		{
			var responseHTML = buildUserViewUser(result);
			  
			var myQry1 = 'SELECT * FROM Friends JOIN Profile ON Friends.FriendID = Profile.UserID WHERE Friends.UserID=' + req.query.UserID;
  
            console.log(myQry1);
  			connection.query(myQry1, function (err, result1) 
			{
				if (err) 
				{
					handleError(res, err);
				}
				else 
				{
					// Build the HTML table from the data in the Student table
					responseHTML += '<h1>Friend Profiles</h1>';
					responseHTML += '<form method="GET" action="/profile/">';
					responseHTML += 'Select a Friends Profile: <select name="UserID" id="UserID">';
              
					//Dynamic populating rows from the records returned
					for (var i=0; i < result1.length; i++) 
					{
						responseHTML += '<option value="' + result1[i].FriendID + '">' + result1[i].FirstName + " " + result1[i].LastName + '</option>';
					}

					responseHTML += '</select>';
					responseHTML += '&nbsp;<input type="submit" />';
					responseHTML += '</form>';
					responseHTML += '<br>' + '<br />' + '<hr>' + '</hr>' + '<br>' + '<br />';
				
					responseHTML += '<h1>Show List </h1>';
						
					var myQry2 = 'SELECT * FROM TVViewer JOIN TV ON TVViewer.TVShowID = TV.ShowID WHERE ViewerID=' + req.query.UserID;
  
					console.log(myQry2);
					connection.query(myQry2, function (err, result2) 
					{
						if (err) 
						{
							console.log(err);
							throw err;
							res.send('An error occured');
						}
						else 
						{
							// Build the HTML table from the data in the Course table
							responseHTML += '<table border=1>';
							responseHTML += '<tr><th>Show Name</th><th>Rating</th><th><!-- More Info Column --></th><th><!-- Delete Column --></th></tr>';
              
							//Dynamic populating rows from the records returned
							for (var i=0; i < result2.length; i++) 
							{
								responseHTML += '<tr><td>' + result2[i].ShowName + '</td>' +
								'<td>' + result2[i].Rating + '</td>' +
								'<td><a href="/tv/?ShowID=' + result2[i].TVShowID + '">more info</a>' +
								'<td><a href="/tvviewer/delete?TVShowID=' + result2[i].TVShowID + '&ViewerID=' + req.query.UserID + '">delete</a>' +
								'</tr>';
							}

							responseHTML += '</table>';
							responseHTML +=	'<br>' + '<a href="/tvviewer/add?ViewerID=' + req.query.UserID + '"> Add a Show </a>' + '<br />'
					
							var myQry3 = 'SELECT * FROM MovieViewer JOIN Movie ON MovieViewer.MovieID = Movie.MovieID WHERE ViewerID=' + req.query.UserID;
  
							console.log(myQry3);
							connection.query(myQry3, function (err, result3) 
							{
								if (err) 
								{
									console.log(err);
									throw err;
									res.send('An error occured');
								}
								else 
								{
									// Build the HTML table from the data in the Course table
									responseHTML += '<h1>Movie List</h1>'; 
									responseHTML += '<table border=1>';
									responseHTML += '<tr><th>Movie Title</th><th>Rating</th><th><!-- More Info Column --><th><!-- Delete Column --></th></th></tr>';
              
									//Dynamic populating rows from the records returned
									for (var i=0; i < result3.length; i++) 
									{
										responseHTML += '<tr><td>' + result3[i].MovieName + '</td>' +
										'<td>' + result3[i].Rating + '</td>' +
										'<td><a href="/movie/?MovieID=' + result3[i].MovieID + '">more info</a>' +
										'<td><a href="/movieviewer/delete?MovieID=' + result3[i].MovieID + '&ViewerID=' + req.query.UserID + '">delete</a>' +
										'</tr>';
									}

									responseHTML += '</table>';
									responseHTML +=	'<br>' + '<a href="/movieviewer/add?ViewerID=' + req.query.UserID + '"> Add a Movie </a>' + '<br />'
				
									responseHTML += '<br>' + '<br />' + '<hr>' + '</hr>' + '<br>' + '<br />';
									responseHTML += '<h1>Friend Options </h1>';
									responseHTML +=	'<br>' + '<a href="/friends/add?UserID=' + req.query.UserID + '"> Add a friend </a>' + '<br />'
									+ '<br>' + '<a href="/friends/delete?UserID=' + req.query.UserID + '"> Delete a friend </a>' + '<br />';
									responseHTML += '<br></br>' + '<a href="/">Back </a>';				
									res.send(responseHTML);
								}
							});
						}
					});
				}
			});
		}
	});
});


// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/profile/add', function (req, res) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Add Profile Information</h1>';

    responseHTML += '<form action="/profile/insert" method="GET">';

    //Dynamic populating rows from the records returned
    

    //using an inline or ternary if to replace null with an empty string, otherwise null
    //will appear in the input field
    
    responseHTML += 'First Name: <input type="text" Name="FirstName" id="FirstName"  /><br />' +
                    'Last Name: <input type="text" Name="LastName" id="LastName" /><br />' +
                    'Email: <input type="text" Name="Email" id="Email" />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

    res.send(responseHTML);
    
});


// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/profile/insert', function (req, res) {

    var myQry = 'INSERT INTO Profile(FirstName, LastName, Email) VALUES(\'' + req.query.FirstName + '\',\'' + req.query.LastName + '\',\'' + req.query.Email + '\')';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
               var responseHTML = '<h1>Profile Information</h1>'; 
               responseHTML += '<ul><li>First Name: ' + req.query.FirstName + '</li>' +
                '<li>Last Name: ' + req.query.LastName + '</li>' +
                '<li>Email: ' + req.query.Email + '</li></ul>'
               responseHTML += '<br></br>' + '<a href="/">Back </a>';
			   res.send(responseHTML);
            
        
                }
                
            }
        
    );
});

// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/profile/edit', function (req, res) {

    var myQry = 'SELECT * FROM Profile WHERE UserID=' + req.query.UserID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Profile Information</h1>';

                responseHTML += '<form action="/profile/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    //using an inline or ternary if to replace null with an empty string, otherwise null
                    //will appear in the input field
                    responseHTML += 'First Name: <input type="text" Name="FirstName" id="FirstName" value="' + result[0].FirstName + '" /><br />' +
                        'Last Name: <input type="text" Name="LastName" id="LastName" value="' + result[0].LastName + '" /><br />' +
                        'Email: <input type="text" Name="Email" id="Email" value="' + result[0].Email + '" />' +
                        '<input type="hidden" Name="UserID" id="UserID" value="' + result[0].UserID + '" /><br />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});



// Delete a record from the Student table and retrieve their Name and Major

app.get('/profile/delete', function(req, res) {
    console.log(req.query.UserID);
    var query = 'DELETE FROM Profile Where UserID= ' + req.query.UserID; 
    console.log(query);
    connection.query(query, function (err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM Profile', function (err, result) {
            if (err) 
            {
                console.log(err);
                res.send('An error has occured!');
                return;
            }
            else if(result.length >= 1) {
                res.send('Profile successfully deleted!');
                
            }
            else 
            {
                res.send('No profiles remain in the table.');
            }
        });
    });
});

// Update a student's name and major given their Student_number
app.get('/profile/update', function (req, res) {

    var myQry = 'UPDATE Profile SET FirstName="' + req.query.FirstName + '", LastName="' + req.query.LastName + '", Email="' + req.query.Email + '" WHERE UserID=' + req.query.UserID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Profile WHERE UserID =' + req.query.UserID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildUserViewUser(result));
                        }
                        else {
                            res.send('No profile found matching that description.');
                        }
                 });
            }
        }
    );
});


// HTML Example with data populated from the Course table

app.get('/movie/view/table', function (req, res) {
  
  var myQry = 'SELECT * FROM Movie';
  
  console.log(myQry);
  
  connection.query(myQry,  
        function (err, result) {
            if (err) {
              console.log(err);
	      throw err;
	      res.send('An error occured');
              
            }
            else {
              // Build the HTML table from the data in the Course table
              var responseHTML = '<h1>Movie Table</h1>'; 
              responseHTML += '<table border=1>';
              responseHTML = responseHTML + '<tr><th>Title</th><th>Year Released</th><th><!-- More Info Column --></th><th><!-- Edit Info Column --></th></tr>';
              
              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<tr><td>' + result[i].MovieName + '</td>' +
                                '<td>' + result[i].YearReleased + '</td>' +
                                '<td><a href="/movie/?MovieID=' + result[i].MovieID + '">more info</a>' +
                                '<td><a href="/movie/edit?MovieID=' + result[i].MovieID + '">edit</a>' +
                                '<td><a href="/movie/delete?MovieID=' + result[i].MovieID + '">delete</a>' +
                                '</tr>'
              }

              responseHTML += '</table>';
              responseHTML += '<br></br>' + '<a href="/">Back </a>';
			  res.send(responseHTML);
            }
        }
    );
});


// Display information about a Course when given their Course_number
app.get('/movie/', function (req, res) {
  
  var myQry = 'SELECT * FROM Movie WHERE MovieID=' + req.query.MovieID;
  
  console.log(myQry);
  
  connection.query(myQry,  
        function (err, result) {
            if (err) {
              console.log(err);
	      throw err;
	      res.send('An error occured');
              
            }
            else {
              // Build the HTML table from the data in the Student table
              var responseHTML = '<h1>Movie Information</h1>'; 
              
              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<ul><li>Title: ' + result[i].MovieName + '</li>'
                + '<li>Year Released: ' + result[i].YearReleased + '</li>'
                + '<li>Rating: ' + result[i].Rating + '</li>'
                + '<li>Genre: ' + result[i].Genre + '</li></ul>'
              }
			responseHTML += '<br></br>' + '<a href="/">Back </a>';
              res.send(responseHTML);
            }
        }
    );
});


// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/movie/add', function (req, res) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Add Movie Information</h1>';

    responseHTML += '<form action="/movie/insert" method="GET">';

    //Dynamic populating rows from the records returned
    

    //using an inline or ternary if to replace null with an empty string, otherwise null
    //will appear in the input field
    
    responseHTML += 'Title: <input type="text" Name="MovieName" id="MovieName"  /><br />' +
                    'Year Released: <input type="text" Name="YearReleased" id="YearReleased" /><br />' +
                    'Rating: <select id="Rating" name="Rating">' +
                        '<option value="G">G' +
                        '<option value="PG">PG' +
                        '<option value="PG-13">PG-13' +
                        '<option value="R">R' +
                        '</select><br />' +
                    'Genre: <input type="text" Name="Genre" id="Genre" /><br />' +
                    '<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

    res.send(responseHTML);
    
});


// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/movie/insert', function (req, res) {

    var myQry = 'INSERT INTO Movie(MovieName, YearReleased, Rating, Genre) VALUES(\'' + req.query.MovieName + '\',' + req.query.YearReleased + ',\'' + req.query.Rating + '\',\'' + req.query.Genre + '\')';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                
               var responseHTML = '<h1>Movie Information</h1>'; 
               responseHTML += '<ul><li>Movie Title: ' + req.query.MovieName + '</li>' +
                '<li>Year Released: ' + req.query.YearReleased + '</li>' +
                '<li>Rating: ' + req.query.Rating + '</li>' +
                '<li>Genre: ' + req.query.Genre + '</li></ul>';

                responseHTML += '<form action="/movie/update" method="GET">';
				responseHTML += '<br></br>' + '<a href="/">Back </a>';
                res.send(responseHTML);
                }
                
            }
        
    );
});


// Display information about a Student when given their Student_number and allow them to edit it.
app.get('/movie/edit', function (req, res) {

    var myQry = 'SELECT * FROM Movie WHERE MovieID=' + req.query.MovieID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit Movie Information</h1>';

                responseHTML += '<form action="/movie/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    //using an inline or ternary if to replace null with an empty string, otherwise null
                    //will appear in the input field
                    
                    responseHTML += 'Title: <input type="text" Name="MovieName" id="MovieName" value="' + result[0].MovieName + '" /><br />' +
                        'Year Released: <input type="text" Name="YearReleased" id="YearReleased" value="' + result[0].YearReleased + '" /><br />' +
                        'Rating: <select id="Rating" name="Rating" />' +
                            '<option value="G">G' +
                            '<option value="PG">PG' +
                            '<option value="PG-13">PG-13' +
                            '<option value="R">R' + 
                            '</select><br />' +
                        'Genre: <input type="text" Name="Genre" id="Genre" value="' + result[0].Genre + '" /><br />' +
                        '<input type="hidden" Name="MovieID" id="MovieID" value="' + result[0].MovieID + '" />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});


// Delete a record from the Student table and retrieve their Name and Major

app.get('/movie/delete', function(req, res) {
    console.log(req.query.MovieID);
    var query = 'DELETE FROM Movie Where MovieID= ' + req.query.MovieID; 
    console.log(query);
    connection.query(query, function (err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM Movie', function (err, result) {
            if (err) 
            {
                console.log(err);
                res.send('An error has occured!');
                return;
            }
            else if(result.length >= 1) {
                res.send('Movie successfully deleted!');
                
            }
            else 
            {
                res.send('No movies remain in the table.');
            }
        });
    });
});

// Update a student's name and major given their Student_number
app.get('/movie/update', function (req, res) {

    var myQry = 'UPDATE Movie SET MovieName="' + req.query.MovieName + '", YearReleased="' + req.query.YearReleased + '", Rating="' + req.query.Rating + '", Genre="' + req.query.Genre + '" WHERE MovieID=' + req.query.MovieID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Movie WHERE MovieID = ' + req.query.MovieID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildUserViewMovie(result));
                        }
                        else {
                            res.send('No movie found.');
                        }
                 });
            }
        }
    );
});


// HTML Example with data populated from the Course table

app.get('/tv/view/table', function (req, res) {
  
  var myQry = 'SELECT * FROM TV';
  
  console.log(myQry);
  
  connection.query(myQry,  
        function (err, result) {
            if (err) {
              console.log(err);
	      throw err;
	      res.send('An error occured');
              
            }
            else {
              // Build the HTML table from the data in the Course table
              var responseHTML = '<h1>TV Table</h1>'; 
              responseHTML += '<table border=1>';
              responseHTML = responseHTML + '<tr><th>Title</th><th>Rating</th><th><!-- More Info Column --></th><th><!-- Edit Info Column --></th></tr>';
              
              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<tr><td>' + result[i].ShowName + '</td>' +
                                '<td>' + result[i].Rating + '</td>' +
                                '<td><a href="/tv/?ShowID=' + result[i].ShowID + '">more info</a>' +
                                '<td><a href="/tv/edit?ShowID=' + result[i].ShowID + '">edit</a>' +
                                '<td><a href="/tv/delete?ShowID=' + result[i].ShowID + '">delete</a>' +
                                '</tr>'
              }

              responseHTML += '</table>';
              responseHTML += '<br></br>' + '<a href="/">Back </a>';
			  res.send(responseHTML);
            }
        }
    );
});


// Display information about a Course when given their Course_number
app.get('/tv/', function (req, res) {
  
  var myQry = 'SELECT * FROM TV WHERE ShowID=' + req.query.ShowID;
  
  console.log(myQry);
  
  connection.query(myQry,  
        function (err, result) {
            if (err) {
              console.log(err);
	      throw err;
	      res.send('An error occured');
              
            }
            else {
              // Build the HTML table from the data in the Student table
              var responseHTML = '<h1>Show Information</h1>'; 
              
              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<ul><li>Title: ' + result[i].ShowName + '</li>'
                + '<li>Seasons: ' + result[i].Seasons + '</li>'
                + '<li>Rating: ' + result[i].Rating + '</li>'
                + '<li>Genre: ' + result[i].Genre + '</li>'
				+ '<li>Air Time: ' + result[i].AirTime + '</li></ul>';
              }
				responseHTML += '<br></br>' + '<a href="/">Back </a>';
              res.send(responseHTML);
            }
        }
    );
});


// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/tv/add', function (req, res) {

    // Build the HTML table from the data in the Student table
    var responseHTML = htmlHeader + '<h1>Add TV Show Information</h1>';

    responseHTML += '<form action="/tv/insert" method="GET">';

    //Dynamic populating rows from the records returned
    

    //using an inline or ternary if to replace null with an empty string, otherwise null
    //will appear in the input field
    
    responseHTML += 'Title: <input type="text" Name="ShowName" id="ShowName"  /><br />' +
                    'Seasons: <input type="text" Name="Seasons" id="Seasons" /><br />' +
                    'Rating: <select id="Rating" name="Rating">' +
                        '<option value="Y">Y' +
                        '<option value="Y7">Y7' +
                        '<option value="G">G' +
                        '<option value="PG">PG' +
						'<option value="14">14' +
						'<option value="MA">MA' +
                        '</select><br />' +
                    'Genre: <input type="text" Name="Genre" id="Genre" /><br />' +
                    'Air Time: <select id="AirTime" name="AirTime">' +
                        '<option value="Fall">Fall' +
                        '<option value="Winter">Winter' +
                        '<option value="Spring">Spring' +
                        '<option value="Summer">Summer' +
                        '</select><br />' +
					'<input type="submit" />' +
                    '</form>' +
                    htmlFooter;

    res.send(responseHTML);
    
});


// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/tv/insert', function (req, res) {

    var myQry = 'INSERT INTO TV(ShowName, Seasons, Rating, Genre, AirTime) VALUES(\'' + req.query.ShowName + '\',' + req.query.Seasons + ',\'' + req.query.Rating + '\',\'' + req.query.Genre + '\',\'' + req.query.AirTime + '\')';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                
               var responseHTML = '<h1>TV Show Information</h1>'; 
               responseHTML += '<ul><li>Movie Title: ' + req.query.ShowName + '</li>' +
                '<li>Seasons: ' + req.query.Seasons + '</li>' +
                '<li>Rating: ' + req.query.Rating + '</li>' +
                '<li>Genre: ' + req.query.Genre + '</li>'
				'<li>AirTime: ' + req.query.AirTime + '</li></ul>';

                responseHTML += '<form action="/tv/update" method="GET">';
				responseHTML += '<br></br>' + '<a href="/">Back </a>';
                res.send(responseHTML);
                }
                
            }
        
    );
});


// Display information about a Student when given their Student_number and allow them to edit it.
app.get('/tv/edit', function (req, res) {

    var myQry = 'SELECT * FROM TV WHERE ShowID=' + req.query.ShowID;

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit TV Show Information</h1>';

                responseHTML += '<form action="/tv/update" method="GET">';

                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    //using an inline or ternary if to replace null with an empty string, otherwise null
                    //will appear in the input field
                    
                    responseHTML += 'Title: <input type="text" Name="ShowName" id="ShowName" value="' + result[0].ShowName + '" /><br />' +
                        'Seasons: <input type="text" Name="Seasons" id="Seasons" value="' + result[0].Seasons + '" /><br />' +
                        'Rating: <select id="Rating" name="Rating" />' +
							'<option value="Y">Y' +
							'<option value="Y7">Y7' +
							'<option value="G">G' +
							'<option value="PG">PG' +
							'<option value="14">14' +
							'<option value="MA">MA' + 
							'</select><br />' +
                        'Genre: <input type="text" Name="Genre" id="Genre" value="' + result[0].Genre + '" /><br />' +
                        'AirTime: <input type="text" Name="AirTime" id="AirTime" value="' + result[0].AirTime + '" /><br />' +
						'<input type="hidden" Name="ShowID" id="ShowID" value="' + result[0].ShowID + '" />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;
					responseHTML += '<br></br>' + '<a href="/">Back </a>';
                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});


// Delete a record from the Student table and retrieve their Name and Major

app.get('/tv/delete', function(req, res) {
    console.log(req.query.MovieID);
    var query = 'DELETE FROM TV Where ShowID= ' + req.query.ShowID; 
    console.log(query);
    connection.query(query, function (err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM TV', function (err, result) {
            if (err) 
            {
                console.log(err);
                res.send('An error has occured!');
                return;
            }
            else if(result.length >= 1) {
                res.send('Show successfully deleted!');
                
            }
            else 
            {
                res.send('No Shows remain in the table.');
            }
        });
    });
});

// Update a student's name and major given their Student_number
app.get('/tv/update', function (req, res) {

    var myQry = 'UPDATE TV SET ShowName="' + req.query.ShowName + '", Seasons="' + req.query.Seasons + '", Rating="' + req.query.Rating + '", Genre="' + req.query.Genre + '", AirTime="' + req.query.AirTime + '" WHERE ShowID=' + req.query.ShowID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM TV WHERE ShowID = ' + req.query.ShowID,
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send(buildUserViewTV(result));
                        }
                        else {
                            res.send('No show found.');
                        }
                 });
            }
        }
    );
});

// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/friends/add', function (req, res) {

	var responseHTML = htmlHeader + '<h1>Add Friend</h1>';

	responseHTML += '<form action="/friends/insert" method="GET">';

	myQry = 'SELECT * FROM Profile';
  
	console.log(myQry);
  	connection.query(myQry, function (err, result) {
		if (err) {
			handleError(res, err);
		}
		else {
			// Build the HTML table from the data in the Student table
			responseHTML += '<br>' + '<input type="hidden" Name="UserID" id="UserID" value="' + req.query.UserID + '" />' + '</br>';
			responseHTML += 'Select a user: <select name="FriendID" id="FriendID">';
             
			//Dynamic populating rows from the records returned
			for (var i=0; i < result.length; i++) {
				responseHTML += '<option value="' + result[i].UserID + '">' + result[i].FirstName + " " + result[i].LastName + '</option>';
			}

			responseHTML += '</select><br></br>';
			responseHTML += '&nbsp;<input type="submit" />';
			responseHTML += '</form>';
			res.send(responseHTML);
		}
    });
});

// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/friends/insert', function (req, res) {

    var myQry = 'INSERT INTO Friends(UserID, FriendID) VALUES(' + req.query.UserID + ',' + req.query.FriendID + '), (' + req.query.FriendID + ',' + req.query.UserID + ')';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
               var responseHTML = 'Friendship successfully added!' + '<br></br>' + '<a href="/">Back </a>';
			   res.send(responseHTML);
            
        
                }
                
            }
        
    );
});

// Delete a record from the Student table and retrieve their Name and Major
app.get('/friends/delete', function (req, res) {

	var responseHTML = htmlHeader + '<h1>Delete Friend</h1>';

	responseHTML += '<form action="/friends/deleted" method="GET">';

	myQry = 'SELECT * FROM Friends JOIN Profile ON Friends.FriendID = Profile.UserID Where Friends.UserID=' + req.query.UserID;
  
	console.log(myQry);
  	connection.query(myQry, function (err, result) {
		if (err) {
			handleError(res, err);
		}
		else {
			// Build the HTML table from the data in the Student table
			responseHTML += '<br>' + '<input type="hidden" Name="UserID" id="UserID" value="' + req.query.UserID + '" />' + '</br>';
            responseHTML += 'Select a Friend: <select name="FriendID" id="FriendID">'; 
			
			//Dynamic populating rows from the records returned
			for (var i=0; i < result.length; i++) {
				responseHTML += '<option value="' + result[i].UserID + '">' + result[i].FirstName + " " + result[i].LastName + '</option>';
			}

			responseHTML += '</select><br></br>';
			responseHTML += '&nbsp;<input type="submit" />';
			responseHTML += '</form>';
			res.send(responseHTML);
		}
	});
});
app.get('/friends/deleted', function(req, res) {
    console.log(req.query.UserID);
    var query = 'DELETE FROM Friends Where UserID= ' + req.query.UserID + ' AND FriendID=' + req.query.FriendID + ' OR FriendID=' + req.query.UserID+ ' and UserID=' + req.query.FriendID; 
    console.log(query);
    connection.query(query, function (err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM Friends', function (err, result) {
            if (err) 
            {
                console.log(err);
                res.send('An error has occured!');
                return;
            }
            else if(result.length >= 1) {
                res.send('Friend successfully deleted!');
                
            }
            else 
            {
                res.send('No friends remain in the table.');
            }
        });
    });
});

app.get('/tvviewer/add', function (req, res) {

	var responseHTML = htmlHeader + '<h1>Add Show To Watch List</h1>';

	responseHTML += '<form action="/tvviewer/insert" method="GET">';

	myQry = 'SELECT * FROM TV';
  
	console.log(myQry);
  	connection.query(myQry, function (err, result) {
		if (err) {
			handleError(res, err);
		}
		else {
			// Build the HTML table from the data in the Student table
			responseHTML += '<br>' + '<input type="hidden" Name="ViewerID" id="ViewerID" value="' + req.query.ViewerID + '" />' + '</br>';
			responseHTML += 'Select a Show: <select name="TVShowID" id="TVShowID">';
             
			//Dynamic populating rows from the records returned
			for (var i=0; i < result.length; i++) {
				responseHTML += '<option value="' + result[i].ShowID + '">' + result[i].ShowName + '</option>';
			}

			responseHTML += '</select><br></br>';
			responseHTML += '&nbsp;<input type="submit" />';
			responseHTML += '</form>';
			res.send(responseHTML);
		}
    });
});

// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/tvviewer/insert', function (req, res) {
    var myQry = 'INSERT INTO TVViewer(ViewerID, TVShowID) VALUES(' + req.query.ViewerID + ',' + req.query.TVShowID + ')';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
               var responseHTML = 'Show successfully added to list!' + '<br></br>' + '<a href="/">Back </a>';
			   res.send(responseHTML);
            
        
                }
                
            }
        
    );
});


app.get('/tvviewer/delete', function(req, res) {
    console.log(req.query.UserID);
    var query = 'DELETE FROM TVViewer Where ViewerID= ' + req.query.ViewerID + ' AND TVShowID=' + req.query.TVShowID; 
    console.log(query);
    connection.query(query, function (err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM TVViewer', function (err, result) {
            if (err) 
            {
                console.log(err);
                res.send('An error has occured!');
                return;
            }
            else if(result.length >= 1) {
                res.send('Show successfully deleted!');
                
            }
            else 
            {
                res.send('No shows remain in the list.');
            }
        });
    });
});

app.get('/movieviewer/add', function (req, res) {

	var responseHTML = htmlHeader + '<h1>Add Movie To Watch List</h1>';

	responseHTML += '<form action="/movieviewer/insert" method="GET">';

	myQry = 'SELECT * FROM Movie';
  
	console.log(myQry);
  	connection.query(myQry, function (err, result) {
		if (err) {
			handleError(res, err);
		}
		else {
			// Build the HTML table from the data in the Student table
			responseHTML += '<br>' + '<input type="hidden" Name="ViewerID" id="ViewerID" value="' + req.query.ViewerID + '" />' + '</br>';
			responseHTML += 'Select a Movie: <select name="MovieID" id="MovieID">';
             
			//Dynamic populating rows from the records returned
			for (var i=0; i < result.length; i++) {
				responseHTML += '<option value="' + result[i].MovieID + '">' + result[i].MovieName + '</option>';
			}

			responseHTML += '</select><br></br>';
			responseHTML += '&nbsp;<input type="submit" />';
			responseHTML += '</form>';
			res.send(responseHTML);
		}
    });
});

// Display information about a Student when given their Student_number and allow them to edit it.

app.get('/movieviewer/insert', function (req, res) {

    var myQry = 'INSERT INTO MovieViewer(ViewerID, MovieID) VALUES(' + req.query.ViewerID + ',' + req.query.MovieID + ')';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
               var responseHTML = 'Movie successfully added to list!' + '<br></br>' + '<a href="/">Back </a>';
			   res.send(responseHTML);
            
        
                }
                
            }
        
    );
});


app.get('/movieviewer/delete', function(req, res) {
    console.log(req.query.UserID);
    var query = 'DELETE FROM MovieViewer Where ViewerID= ' + req.query.ViewerID + ' AND MovieID=' + req.query.MovieID; 
    console.log(query);
    connection.query(query, function (err, result) {
        if (err) throw err;
        connection.query('SELECT * FROM MovieViewer', function (err, result) {
            if (err) 
            {
                console.log(err);
                res.send('An error has occured!');
                return;
            }
            else if(result.length >= 1) {
                res.send('Movie successfully deleted!');
                
            }
            else 
            {
                res.send('No movies remain in the list.');
            }
        });
    });
});

// Begin listening

app.listen(8010);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
