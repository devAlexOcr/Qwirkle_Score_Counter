import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './qwirkle.css';

Modal.setAppElement('#root');

function QwirkleCounter() {

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [lastTuileClicked, setLastTuileClicked] = useState(false);

  const handleAddPlayer = () => {
    if (newPlayerName) {
      setPlayers([...players, { name: newPlayerName, score: 0, turns: 0, qwirkleClicks: 0 }]);
      setNewPlayerName('');
    }
  };

  const handleAddScore = () => {
    if (currentScore > 0) {
      const updatedPlayers = [...players];
      const currentPlayer = updatedPlayers[currentPlayerIndex];

      const updatedPlayer = {
        ...currentPlayer,
        score: (currentPlayer.score || 0) + currentScore,
        turns: (currentPlayer.turns || 0) + 1,
      };

      updatedPlayers[currentPlayerIndex] = updatedPlayer;

      setPlayers(updatedPlayers);
      setCurrentScore(0);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }
  };

  const handleQwirkleClick = () => {
    if(players.length !== 0){
      const updatedPlayers = [...players];
      const currentPlayer = updatedPlayers[currentPlayerIndex];

      const updatedPlayer = {
        ...currentPlayer,
        qwirkleClicks: (currentPlayer.qwirkleClicks || 0) + 1,
      };

      updatedPlayers[currentPlayerIndex] = updatedPlayer;

      setPlayers(updatedPlayers);
    }else{ 
      alert('Veuillez créer au moins un joueur')
    }
  };

  useEffect(() => {
    if (lastTuileClicked) {
      const handleShowWinner = async () => {
        await setCurrentScore(0);
        await setCurrentPlayerIndex((cpi) => (cpi + 1) % players.length);

        const maxScore = Math.max(...players.map((player) => player.score));
        const winners = players.filter((player) => player.score === maxScore);

        if (winners.length === 1) {
          setWinnerName(winners[0].name);
        } else {
          setWinnerName('Tie!');
        }

        setIsModalOpen(true);
      };

      handleShowWinner();
    }
  }, [currentScore, lastTuileClicked, players]);

  const handleLastTuile = () => {
    // const lastTuilePoints = 6;
    // setCurrentScore((cs) => cs + lastTuilePoints);
  
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player, index) => {
        if (index === currentPlayerIndex) {
          return {
            ...player,
            score: (player.score || 0) + currentScore + 6,
          };
        }
        return player;
      });
    });
  
    setLastTuileClicked(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section>
      <div className="bg" id="title">
        <h1>Score Counter</h1>
      </div>
      <div id="players">
        <input
          type="text"
          placeholder="Enter Player Name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>

      <div className="bg">
        <h2 id="currentPlayer">{players[currentPlayerIndex]?.name.toUpperCase()}</h2>
        <h2 id="point">Points: {currentScore}</h2>
      </div>
      <div id="points">
        <button className="pts" onClick={() => setCurrentScore((cs) => cs + 2)}>2</button>
        <button className="pts" onClick={() => setCurrentScore((cs) => cs + 3)}>3</button>
        <button className="pts" onClick={() => setCurrentScore((cs) => cs + 4)}>4</button>
        <button className="pts" onClick={() => setCurrentScore((cs) => cs + 5)}>5</button>
        <button className="pts" onClick={() => { setCurrentScore((cs) => cs + 12); handleQwirkleClick(); }}>Qwirkle</button>
        <button className="pts" onClick={handleLastTuile}>Last Tile</button>
        <button className="pts" onClick={handleAddScore}>Add Score</button>
        <button className="pts" onClick={() => setCurrentScore(0)}>Reset</button>
        <button onClick={()=>window.location.reload()}>New Game </button>
      </div>

      <h2 className="bg" id="scores">Scores:</h2>
      {players.map((player) => (
        <div key={player.name} className="player">
          <p>
            {player.name}: 
          </p>
          <div className='data'>
          <li>Score - {player.score || 0}</li>
          <li>Tours - {player.turns || 0}</li>
          <li>Qwirkles - {player.qwirkleClicks || 0}</li>
          </div>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Winner Modal"
      >
        <h2>Winner is : </h2>
        <p id='winner'>{winnerName}</p>
        <button onClick={()=>window.location.reload()}>New Game </button>
        <button onClick={()=>handleCloseModal()}>Close</button>
      </Modal>
    </section>
  );
}

export default QwirkleCounter;