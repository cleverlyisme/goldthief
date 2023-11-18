export const defaultTreasures = [
  { type: 1, img: "/assets/images/firstTreasure.png", point: 10, quantity: 3 },
  {
    type: 2,
    img: "/assets/images/secondTreasure.png",
    point: 20,
    quantity: 2,
  },
  { type: 3, img: "/assets/images/thirdTreasure.png", point: 30, quantity: 1 },
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
    title: "Congratilations",
    text: "You won!",
    img: "/assets/images/win.png",
  },
  {
    variant: "lose",
    title: "Congratilations",
    text: "You lose the game!",
    img: "/assets/images/lose.png",
  },
  {
    variant: "draw",
    title: "Draw",
    text: "We can't find the winner...",
    img: "/assets/images/draw.png",
  },
];
