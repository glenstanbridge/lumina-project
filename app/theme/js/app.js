var lumina = (function () {
	"use strict";
	return {
		Initialise: function () {
			lumina.Questions.Setup();
		},
		
		Questions: {
			Setup: function () {
				$.ajax({
                    method: "POST",
                    url: "ajax.php",
                    data: {command: "getQuestions"},
                  }).done(function(data) {
					$.each(JSON.parse(data), function (id,v) { 
						$('form.questions').append(lumina.Questions.PopulateQuestion(id, v));
					});
					$('form.questions .question:last').find('button').html('Complete');
					$('form.questions .question:first').addClass('active');
					//add listeners for radio button changes
					$('input[type=radio]').change(function() {
						$(this).parent().find('button').removeAttr('disabled');
					});

					//add listeners for question submit button
					$('form.questions button').click(function(e) {
						e.preventDefault();
						$(this).parent().parent().toggleClass('active answered');
						$(this).parent().parent().next().toggleClass('active');

						//detects if last question is answered and submits via ajax to retrieve scores
						if ($(this).html() === 'Complete') {
							lumina.Questions.SubmitAnswers();
						}
					});

					//add listener to submit username button
					$('form.save-score button').click(function(e) {
						e.preventDefault();
						lumina.Questions.SubmitUsername();
					});
				});
			},
			PopulateQuestion: function(id, data) {
				//populates a question - could be improved by creating a template and using the template instead of creating HTML on the fly
				var question = '<div class="question" data-id="' + id + '"><div class="question__container"><h2>' + data.question + '</h2>';
				$.each(data.options, function (i,v) {
					question += '<input type="radio" id="' + id + '-' + i + '" name="question-' + id + '" value="' + v + '">';
					question += '<label for="' + id + '-' + i + '">' + v + '</label>';
				});
				question += '<button disabled>Next</button></div></div>';
				return question;
			},
			SubmitAnswers: function() {
				var data = {
					command: "submitAnswers"
				};
				data.answers = $('form').serializeArray();
				$.ajax({
					method: "POST",
                    url: "ajax.php",
					data: data
				}).done(function(data) {
					// display score to user and 
					var json = JSON.parse(data);
					$('form.save-score, form.save-score .question:first').toggleClass('active');
					$('span.score').html(json.score);
				});
			},
			SubmitUsername: function() {
				$.ajax({
					method: "POST",
                    url: "ajax.php",
					data: {
						command: "submitUsername",
						score: parseInt($('span.score').html()),
						username: $('form.save-score input[type=text]').val()
					}
				}).done(function(data) {
					$('form.save-score .question:first').toggleClass('active answered');
					$('form.save-score .question:last').toggleClass('active');
					var json = JSON.parse(data);
					if (json.success) {
						$.each(json.leaderboard, function(i, v) {
							$('table.leaderboard tbody').append('<tr><td>' + v.username + '</td><td>' + v.score + '</td></tr>');
						});
						$('table.leaderboard tfoot td:last').html(json.average);
					} else {
						$('form.save-score .question:last h2').html('Sorry, your score hasn\'t been added.');
					}
				});
				
			}
		}
	};
}());

$(lumina.Initialise);