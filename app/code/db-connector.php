<?php
namespace Lumina;

class Db {

    private $connection;

    function __construct() {
        $this->connection = mysqli_connect("localhost","lumina","lumina","lumina");
        if (mysqli_connect_errno()) {
            echo "Unable to connect to database: " . mysqli_connect_error();
            exit();
        } 
    }

    /**
     * Retrieves the set of questions and options for the quiz from the database and returns as an array
     * 
     * @return array
     */
    public function getQuestions(): array {
        $questions = [];
        $results = $this->connection->query(
            "SELECT * FROM questions LEFT JOIN question_options ON questions.id = question_options.question_id ORDER BY questions.id ASC, question_options.id ASC"
        );
        while($result = $results->fetch_assoc()) {
           $questions[$result['question_id']]['question'] = $result['question'];
           $questions[$result['question_id']]['options'][] = $result['value']; 
        }

        return $questions;
    }

    /**
     * Scores the answers provided by the user against the correct answers in the database and provides an integar of how many are correct
     * 
     * @param array $answers
     * @return int
     */
    public function scoreAnswers(array $answers): int {
        $query = "SELECT COUNT(*) FROM question_options WHERE ";
        $comparators = [];
        foreach ($answers as $answer) {
            $comparators[] = "(question_id = "
                . (int) str_replace('question-', '', $answer['name'])
                . " AND correct = 1 AND value='"
                . mysqli_real_escape_string($this->connection, $answer['value'])
                . "')";
        }

        $query .= implode(' OR ', $comparators);
        $result = $this->connection->query($query);
        return ($result->fetch_row())[0];
    }

    /**
     * Adds a score and username into the database, if succesful returns true, otherwise false
     * 
     * @param int $score
     * @param string $username
     * 
     * @return bool
     */
    public function addScoreAndUsername(int $score, string $username): bool {
        $result = $this->connection->query(
            "INSERT INTO scores (score, username) VALUES ($score, '" .  mysqli_real_escape_string($this->connection, $username) . "')"
        );
        return (mysqli_insert_id($this->connection) > 0);
    }

    /**
     * Gets the top 5 results from the scores table
     * 
     * @return array
     */
    public function getLeaderboard(): array {
        $results = $this->connection->query(
            "SELECT * FROM scores ORDER BY score DESC, id DESC LIMIT 0,5"
        );
        $leaders = [];
        while($result = $results->fetch_assoc()) {
           $leaders[] = [
            'username'  => $result['username'],
            'score'     => $result['score']
           ];
        }

        return $leaders;
    }

    /**
     * Calculates the average score from the scores stored in the db table
     * 
     * @return int
     */
    public function getAverageScore(): int {
        $result = $this->connection->query("SELECT FORMAT(AVG(score), 2) FROM scores");
        return ($result->fetch_row())[0];
    }

}