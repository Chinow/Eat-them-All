//audio managment
Crafty.audio.MAX_CHANNEL=1;

Crafty.audio.add("signCreate", [
        "media/InvocPoto.mp3", 
        "media/InvocPoto.ogg"]);

Crafty.audio.add("signMove", [
        "media/TournagePoto.mp3", 
        "media/TournagePoto.ogg"]);
        
Crafty.audio.add("signDelete", [
        "media/EnlevagePoto.mp3", 
        "media/EnlevagePoto.ogg"]);
        
Crafty.audio.add("signBroken", [
        "media/SignBroken.mp3", 
        "media/SignBroken.ogg"]);
        
Crafty.audio.add("doorOpen", [
        "media/DoorOpening.mp3", 
        "media/DoorOpening.ogg"]);
        
Crafty.audio.add("doorClose", [
        "media/DoorClosing.mp3", 
        "media/DoorClosing.ogg"]);
        
Crafty.audio.add("holeDig", [
        "media/DigHole.mp3", 
        "media/DigHole.ogg"]);
        
Crafty.audio.add("zombieDie", [
        "media/ZombiDies1.mp3", 
        "media/ZombiDies1.ogg"]);
        
Crafty.audio.add("zombieSounds", [
        "media/Zombi1.mp3", 
        "media/Zombi1.ogg"]);
        
Crafty.audio.add("zombieRage", [
        "media/ZombiRage.mp3", 
        "media/ZombiRage.ogg"]);
        
Crafty.audio.add("fortressAttack", [
        "media/ZombiAttackBase.mp3", 
        "media/ZombiAttackBase.ogg"]);
        
Crafty.audio.add("soldierDie", [
        "media/SoldierDies.mp3", 
        "media/SoldierDies.ogg"]);
        
Crafty.audio.add("cityDie", [
        "media/CityDies.mp3", 
        "media/CityDies.ogg"]);
        
Crafty.audio.add("gameOver", [
        "media/GameOver.mp3", 
        "media/GameOver.ogg"]);
        
Crafty.audio.add("pauseStart", [
        "media/PauseBaron.mp3", 
        "media/PauseBaron.ogg"]);

//VOLUME BALANCE
Crafty.audio.settings("signCreate",{volume:0.20});
Crafty.audio.settings("signMove",{volume:0.30});
Crafty.audio.settings("signDelete",{volume:0.30});
Crafty.audio.settings("doorOpen",{volume:0.50});
Crafty.audio.settings("doorClose",{volume:0.50});
Crafty.audio.settings("holeDig",{volume:0.50});
Crafty.audio.settings("zombieDie",{volume:0.50});
Crafty.audio.settings("zombieSounds",{volume:0.50});
Crafty.audio.settings("zombieRage",{volume:0.50});
Crafty.audio.settings("fortressAttack",{volume:1.0});
Crafty.audio.settings("soldierDie",{volume:1.0});
Crafty.audio.settings("cityDie",{volume:0.75});
Crafty.audio.settings("gameOver",{volume:1.0});
Crafty.audio.settings("pauseStart",{volume:0.5});
// Use Crafty.audio.play(String id, number repeat); to play sounds repeat time (-1 => loop)
