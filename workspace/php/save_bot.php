<?php
$head = "const TelegramApi = require('node-telegram-bot-api');";
//$head .="const {gameOptions, againOptions} = require('./options');"; 

$bot_token = $_POST['bot_token'];
$bot_name = $_POST['bot_name'];
$bot_id = $_POST['bot_id'];
$user = $_POST['user'];
$id_user = $_POST['id_user'];

$bot_token = "const token = '$bot_token'; 
const bot = new TelegramApi(token, {polling: true}); \r\n";


$bot_content = "const start = async () => { \r\n";

$bot_commands = "bot.setMyCommands([ \r\n";

$bot_message = "bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

    try {\r\n";

$bot_callbackQuery = "bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;\r\n";


$cmds = $_POST['cmds'];

for ($i=0;$i<count($cmds);$i++){
	$bot_commands .= "{command: '".$cmds[$i][0]."', description: '".$cmds[$i][1]."'}";
	if($i!=count($cmds)-1){
		$bot_commands .= ", \r\n";
	}else{
		$bot_commands .= "\r\n";
	}

    $bot_message .= "if (text === '/".$cmds[$i][0]."') { \r\n";
    $bot_callbackQuery .= "if (data === '/".$cmds[$i][0]."') { \r\n";
    $cmd_btns = "";
    $cmd_buttons = "";
    $cmd_btns = "cmd_".$cmds[$i][0]."_opts";
    if($cmds[$i][3] != 0){
        
        $cmd_buttons .= "const ".$cmd_btns." = { 
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [";

        for ($j=0;$j<count($cmds[$i][3]);$j++){
            $cmd_action_type = "url";
            $cmd_content = $cmds[$i][3][$j][2];
            if($cmds[$i][3][$j][0] == "url"){
                $cmd_action_type = "url";
                $cmd_content = $cmds[$i][3][$j][2];
            }else{
                $cmd_action_type = "callback_data";
                $cmd_content = "/".$cmds[$i][3][$j][2];
            }
            $cmd_buttons .= "[{text: '".$cmds[$i][3][$j][1]."', $cmd_action_type: '".$cmd_content."'}], \r\n";
        }
        $cmd_buttons .= "]
            })
          };";
    }else{
        $cmd_buttons .= "const ".$cmd_btns." = { parse_mode: 'HTML'};";
    }
    $bot_message .= $cmd_buttons;
    $bot_callbackQuery .= $cmd_buttons;
    $text = str_replace('"', '\\"', $cmds[$i][2]);
    $bot_message .="return bot.sendMessage(chatId, '".$text."', ".$cmd_btns."); 
    }";

    $bot_callbackQuery .= "return bot.sendMessage(chatId, '".$text."',".$cmd_btns."); 
    }";
} 
$bot_commands .="]); \r\n";

$bot_message .= "return bot.sendMessage(chatId, 'Такой команды нет!');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибка!'+ e);
        }

    }); \r\n";

$bot_content .= $bot_commands;

$bot_content .= $bot_message;

$bot_content .= $bot_callbackQuery;

$bot_content .= "})} \r\n";


$bot_content .= "start()";



$path = "../bots/".$id_user."/".$bot_id;
$path = str_replace(' ', '', $path);

if (!is_dir($path)) {
	mkdir($path, 0777, true);	
}
echo(file_put_contents($path . "/index.js", $head . $bot_token . $bot_content));

?>