const LETTERS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
const TEXT = [
"Heater 1",
"Heater 2",
"Heater 3",
"Heater 4",
"Clap",
"Open HH",
"Kick 'n Hat",
"Kick",
"Closed HH",
"Chord 1",
"Chord 2",
"Chord 3",
"Shaker",
"Open HH 2",
"Closed HH 2",
"Punchy Kick",
"Side Stick",
"Snare"];

const SOUNDS = [
"https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
"https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"];


$(document).ready(function () {
  let power = true;
  let bank = 1;
  let volume = 50;

  //Either turns the pads on or off, depending on their current state
  function powerChange() {
    power = !power;
    $("#display").text("");
    if (power) {
      $("#power").css("color", "green");
      let j = 0;
      if (bank == 2) {j = 9;}
      for (let i = 0; i < LETTERS.length; i++) {
        $("#" + makeValidText(i + j)).attr("disabled", false);
      }
      $("#bank1").attr("disabled", false);
      $("#bank2").attr("disabled", false);
      if (bank == 2) {
        $("#bank2").css("background-color", "green");
      } else
      {
        $("#bank1").css("background-color", "green");
      }
      $("#vol-slider").attr("disabled", false);

    } else
    {
      $("#power").css("color", "red");
      let j = 0;
      if (bank == 2) {j = 9;}
      for (let i = 0; i < LETTERS.length; i++) {
        $("#" + makeValidText(i + j)).attr("disabled", true);
      }
      $("#bank1").attr("disabled", true);
      $("#bank1").css("background-color", "white");
      $("#bank2").attr("disabled", true);
      $("#bank2").css("background-color", "white");
      $("#vol-slider").attr("disabled", true);
    }
  }

  //Change the bank to the opposite setting of what it currently is. This changes the sound clips to the alternate set
  function bankChange(event) {
    if (bank == 1 && event.target.id == "bank2") {
      bank = 2;
      $("#display").text("");
      $("#bank1").css("background-color", "white");
      $("#bank2").css("background-color", "green");
      setAudioSources();
    } else
    if (bank == 2 && event.target.id == "bank1") {
      bank = 1;
      $("#display").text("");
      $("#bank1").css("background-color", "green");
      $("#bank2").css("background-color", "white");
      setAudioSources();
    }
  }

  //Change the volume to the current setting of the volume slider
  function volChange(e) {
    volume = e.target.value;
    $("#vol-display").text("Volume: " + e.target.value);
  }

  //Convert a string from the TEXT array at the index provided into a valid jQuery selector
  function makeValidText(index) {
    let s = TEXT[index];
    s = s.replace("'", "\\'");
    return s.replace(/\s/g, "\_");
  }

  //Change the audio sources for when a bank change occurs
  function setAudioSources() {
    if (bank == 1) {
      for (let i = 0; i < LETTERS.length; i++) {
        $("#" + LETTERS[i]).attr("src", SOUNDS[i + 9]);
        $("#" + makeValidText(i)).attr("id", makeValidText(i + 9));
      }
    } else
    {
      for (let i = 0; i < LETTERS.length; i++) {
        $("#" + LETTERS[i]).attr("src", SOUNDS[i]);
        $("#" + makeValidText(i + 9)).attr("id", makeValidText(i));
      }
    }
  }

  //Determine, if the machine has power, whether the input came from a button or key press and
  //pass relevant data on what clip should be played and what text to display to playClip   
  function handlePadPress(e) {
    if (power) {
      let clip;
      let index;
      if (e.type == "click") {
        clip = $("#" + e.target.textContent).get(0);
        index = LETTERS.indexOf(e.target.textContent.slice(0, 1));
      } else if (e.type == "keydown") {
        clip = $("#" + String.fromCharCode(e.which)).get(0);
        index = LETTERS.indexOf(String.fromCharCode(e.which));
      }
      if (bank == 2) {index = index + 9;}
      clip.load();
      clip.volume = volume / 100;
      clip.play();
      $("#display").text(TEXT[index]);
    }
  }

  //Initialise various attributes
  function initialise() {
    for (let i = 0; i < LETTERS.length; i++) {
      $("#" + LETTERS[i]).attr("src", SOUNDS[i]);
    }

    $("#bank1").css("background-color", "green");
    $("#bank2").css("background-color", "white");
    $("#power").css("color", "green");
    $("#vol-display").text("Volume: " + volume);
  }

  initialise();

  $("#power").click(powerChange);
  $("#bank2").click(bankChange);
  $("#bank1").click(bankChange);
  $("#vol-slider").on("input", volChange);
  $(document).keydown(handlePadPress);
  for (let i = 0; i < LETTERS.length; i++) {
    $('[id="' + makeValidText(i) + '"]').click(handlePadPress);
  }
});