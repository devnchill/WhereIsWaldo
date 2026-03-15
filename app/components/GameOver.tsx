const GameOver = (data: {
  duration: number;
  rank: number;
}): React.ReactElement => {
  return (
    <div>
      <p>You won</p>
      <p>You took: {data.duration}</p>
      <p>Your rank: {data.rank}</p>
    </div>
  );
};

export default GameOver;
