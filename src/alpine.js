var slimSelectKu = new SlimSelect({
  select: '#chooseMusic',
});

const { Howl, Howler } = require('howler');

var playBtn,
  playList,
  playIndex,
  extension,
  sound,
  titlePlay,
  nextBtn,
  prevBtn,
  selectMusic,
  modeSwitch,
  musicBank,
  howlerBank;

// Set Object References
playBtn = document.getElementById('playPause');
titlePlay = document.getElementById('titleMusic');
nextBtn = document.getElementById('nextPlay');
prevBtn = document.getElementById('prevPlay');
selectMusic = document.getElementById('chooseMusic');
modeSwitch = document.getElementsByName('modeS');

// Music Object

// gfriend = ['fever'];
// twice = ['candypop'];
// playList = twice.concat(gfriend);
playIndex = 0;
musicBank = 'https://mrtampan.github.io/caem_bank/';
// titlePlay.innerText = playList[playIndex];

// Setting Audio Player
extension = 'mp3';
howlerBank = [];

// Event Listener Object
playBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextPlay);
prevBtn.addEventListener('click', prevPlay);
selectMusic.addEventListener('change', chooseMusic);

var playModeValue = 0;
for (let j = 0; j < modeSwitch.length; j++) {
  modeSwitch[j].addEventListener('change', function () {
    if (this == null) {
      playModeValue = 0;
    }
    playModeValue = this.value;
  });
}
console.log(playModeValue);

// Functional

function getDataMusic() {
  fetch(musicBank + 'data.json', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((result) => {
      playList = result.music;

      console.log(result.music);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function setOptionMusic() {
  var df = document.createDocumentFragment();
  console.log(playList);
  for (let i = 0; i < playList.length; i++) {
    let option = document.createElement('option');
    option.value = playList[i].source;
    option.appendChild(document.createTextNode(playList[i].name));
    df.appendChild(option);
  }
  selectMusic.appendChild(df);
}

function runHowler() {
  playList.forEach(function (currentValue, i) {
    howlerBank.push(
      new Howl({
        src: [musicBank + playList[i].source],
        format: ['mp3'],
        onend: onEnd,
        html5: true,
      })
    );
  });
}

function playPause() {
  if (howlerBank[playIndex].playing() === false) {
    howlerBank[playIndex].play();
    playBtn.innerText = 'Pause';
  } else {
    howlerBank[playIndex].pause();
    playBtn.innerText = 'Play';
  }
}

function chooseMusic() {
  howlerBank[playIndex].stop();
  playIndex = selectMusic.selectedIndex;
  howlerBank[playIndex].play();
  changeTitle();
}

function changeTitle() {
  document.title = playList[playIndex].name;
  titlePlay.innerText = playList[playIndex].name;
}

function prevPlay() {
  howlerBank[playIndex].stop();
  if (playIndex == 0) {
    playIndex = 0;
    howlerBank[playIndex].play();
    changeTitle();
  } else {
    playIndex = playIndex - 1;
    console.log(playIndex);
    howlerBank[playIndex].play();
    changeTitle();
  }
}

function nextPlay() {
  howlerBank[playIndex].stop();
  if (playIndex >= playList.length - 1) {
    playIndex = 0;
    howlerBank[playIndex].play();
    changeTitle();
  } else {
    playIndex = playIndex + 1;
    howlerBank[playIndex].play();
    changeTitle();
  }
}

var onEnd = function () {
  if (playModeValue === 1 || playModeValue === '1') {
    playIndex = Math.floor(Math.random() * (playList.length - 1));
    howlerBank[playIndex].play();
    changeTitle();
  } else {
    if (playIndex >= playList.length - 1) {
      playIndex = 0;
      howlerBank[playIndex].play();
      changeTitle();
    } else {
      playIndex = playIndex + 1;
      howlerBank[playIndex].play();
      changeTitle();
    }
  }
};

//Running System
getDataMusic();
setTimeout(() => {
  setOptionMusic();
  changeTitle();
  runHowler();
}, 500);
