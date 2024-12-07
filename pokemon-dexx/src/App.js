import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// กำหนดสีพื้นหลังสำหรับแต่ละธาตุ
const typeColors = {
  grass: '#7CFC00',   // ธาตุหญ้า
  fire: '#FF4500',    // ธาตุไฟ
  water: '#1E90FF',   // ธาตุน้ำ
  poison: '#8A2BE2',  // ธาตุพิษ
  electric: '#FFD700',// ธาตุไฟฟ้า
  ground: '#D2B48C',  // ธาตุดิน
  psychic: '#F8F8FF', // ธาตุจิต
  rock: '#A52A2A',    // ธาตุหิน
  ghost: '#800080',   // ธาตุผี
  dragon: '#8B0000',  // ธาตุมังกร
  dark: '#2F4F4F',    // ธาตุมืด
  fairy: '#FF69B4',   // ธาตุเทพ
  normal: '#D3D3D3'   // ธาตุปกติ
};

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันในการดึงข้อมูลโปเกมอน
  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151');
      const pokemonList = response.data.results;

      const pokemonDetails = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          return pokemonResponse.data;
        })
      );
      
      setPokemonData(pokemonDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>API Pokemon</h1>
      <button onClick={fetchPokemon}>Get pokemon dex</button>

      {loading && <p>Loading...</p>}

      <div className="pokemon-list">
        {pokemonData.map((pokemon) => {
          // กำหนดสีพื้นหลังตามธาตุของโปเกมอน
          const backgroundColor = typeColors[pokemon.types[0].type.name] || '#D3D3D3';  // Default สีธรรมดา

          return (
            <div className="pokemon-card" key={pokemon.id} style={{ backgroundColor }}>
              <h2>{pokemon.name.toUpperCase()}</h2>
              <div className="pokemon-images">
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} />
              </div>
              <div className="pokemon-info">
                <p><strong>Type 1:</strong> {pokemon.types[0].type.name}</p>
                {pokemon.types[1] && <p><strong>Type 2:</strong> {pokemon.types[1].type.name}</p>}
                <p><strong>Base stats:</strong></p>
                <ul>
                  <li>HP: {pokemon.stats[0].base_stat}</li>
                  <li>Attack: {pokemon.stats[1].base_stat}</li>
                  <li>Defense: {pokemon.stats[2].base_stat}</li>
                  <li>Special Attack: {pokemon.stats[3].base_stat}</li>
                  <li>Special Defense: {pokemon.stats[4].base_stat}</li>
                  <li>Speed: {pokemon.stats[5].base_stat}</li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
