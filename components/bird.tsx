interface BirdProps {
  id: string
  size: number
}

export function Bird({ id, size }: BirdProps) {
  let birdSrc

  switch (id) {
    case "yellow":
      birdSrc = "/assets/Flappy bird 1.svg"
      break
    case "red":
      birdSrc = "/assets/Flappy bird 2.svg"
      break
    case "blue":
      birdSrc = "/assets/Flappy bird 3.svg"
      break
    case "green":
      birdSrc = "/assets/Flappy bird 4.svg"
      break
    default:
      birdSrc = "/assets/Flappy bird 1.svg"
  }

  return <img src={birdSrc} width={size + 5} height={size + 5} alt="bird" />
}
