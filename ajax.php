<?php
require_once('app/code/db-connector.php');
use Lumina\Db;
$db = new Db;

switch ($_POST['command']) {
    case 'getQuestions':
        echo json_encode($db->getQuestions());
        break;
    
    case 'submitAnswers':
        echo json_encode(['score' => $db->scoreAnswers($_POST['answers'])]);
        break;

    case 'submitUsername':
        echo json_encode([
            'success'       => $db->addScoreAndUsername($_POST['score'], $_POST['username']),
            'leaderboard'   => $db->getLeaderboard(),
            'average'       => $db->getAverageScore()
        ]);
        break;
}