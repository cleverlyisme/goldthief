import _ from "lodash";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 4);

export const defaultPrepareMapTime = 182;

export const defaultGameTime = 1202;

export const defaultTurnTime = 32;

export const defaultTreasures = [
  { type: 1, img: "/assets/images/firstTreasure.png", point: 10, quantity: 15 },
  {
    type: 2,
    img: "/assets/images/secondTreasure.png",
    point: 20,
    quantity: 10,
  },
  { type: 3, img: "/assets/images/thirdTreasure.png", point: 30, quantity: 5 },
];

export const defaultCoordinates = Array.from(
  { length: 100 },
  (_, i) => i + 1
).map((item) => ({
  coordinate: item,
  typeOfTreasure: null,
  isSelected: false,
}));

export const notis = [
  {
    variant: "win",
    title: "You won",
    text: _.sample([
      "Congratulations ! what an awesome play, keep it up!",
      "Your skill and strategy paid off amazingly well. Well played!",
      "Your determination and clever moves made all the difference. Well done!",
    ]),
    img: "/assets/images/win.png",
  },
  {
    variant: "lose",
    title: "You lose",
    text: _.sample([
      "Great effort! Losing is part of the game, but you played well.",
      "Don't worry, losing happens! You gave it your all.",
      "Hard luck this time! Keep practicing and you'll get there.",
      "Almost there! Keep practicing, you're improving!",
    ]),
    img: "/assets/images/lose.png",
  },
  {
    variant: "draw",
    title: "Draw",
    text: _.sample([
      "We can't find the winner... Both of you doing well.",
      "Nobody won this time! But it was an intense match.",
      "Stalemate! You both demonstrated great skill.",
    ]),
    img: "/assets/images/draw.png",
  },
];
