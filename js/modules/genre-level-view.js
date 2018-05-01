import AbstractView from '../abstract-view';
import TimerView from '../components/timer-view';
import LivesView from '../components/lives-view';
import PlayerView from '../components/player-view';

export default class GenreLevelView extends AbstractView {
  constructor(state, questionObject) {
    super();
    this.state = state;
    this.questions = questionObject;
    this.timer = new TimerView(this.state.time);
    this.lives = new LivesView(this.state);
  }

  get template() {
    return (
      `<section class="main main--level main--level-genre">
        ${this.timer.template}
        ${this.lives.template}
    
        <div class="main-wrap">
          <h2 class="title">${this.questions.question}</h2>
          <form class="genre">
            ${this.questions.answers.map((audio, i) => {
        const index = i + 1;
        const player = new PlayerView(audio.src);
        return (
          `<div class="genre-answer">
              ${player.template}
              <input type="checkbox" name="answer" value="${audio.genre}" id="a-${index}">
              <label class="genre-answer-check" for="a-${index}"></label>
            </div>`
        );
      }).join(``)}
            <button class="genre-answer-send" type="submit">Ответить</button>
          </form>
        </div>
      </section>`
    );
  }

  onSubmit() {}

  bind() {
    const form = this.element.querySelector(`.genre`);
    const answers = Array.from(form.elements.answer);
    const sendButton = form.querySelector(`.genre-answer-send`);
    sendButton.disabled = true;

    const playBtns = Array.from(this.element.querySelectorAll(`.player-control`));

    playBtns.forEach((element) => {
      element.addEventListener(`click`, (event) => {
        event.preventDefault();

        const currentPlayBtn = event.currentTarget;
        const currentSong = currentPlayBtn.previousElementSibling;
        if (currentSong.paused) {
          playBtns.forEach((control) => {
            const song = control.previousElementSibling;
            if (control === currentPlayBtn) {
              control.classList.add(`player-control--pause`);
              song.play();
            } else {
              control.classList.remove(`player-control--pause`);
              song.pause();
            }
          });
        } else {
          currentPlayBtn.classList.remove(`player-control--pause`);
          currentSong.pause();
        }
      });
    });

    form.addEventListener(`change`, () => {
      sendButton.disabled = !answers.some((checkbox) => checkbox.checked);
    });

    form.addEventListener(`submit`, (event) => {
      event.preventDefault();
      const checkedCheckboxes = answers.filter((checkbox) => checkbox.checked);
      const userAnswers = checkedCheckboxes.map((checkbox) => checkbox.value);
      answers.forEach((element) => {
        element.checked = false;
      });
      sendButton.disabled = true;
      this.onSubmit(...userAnswers);
    });
  }
}
