import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import Deezer from './icons/Deezer';
import { showFavorites, changeCurrentSong, nowPlaying, changeVolume } from '../actions';
import { lightGrey } from '../styles';
import { connect } from 'react-redux';

class Header extends React.Component {
  onVolumeChange = (e) => {
    const { volume, changeVolume } = this.props;
    if (e.target.dataset.type === 'plus' && volume < 1) {
      let newVolume = volume + 0.2 > 1 ? 1 : volume + 0.2;
      changeVolume(Number(newVolume.toFixed(1)));
    }
    if (e.target.dataset.type === 'minus' && volume > 0) {
      let newVolume = volume - 0.2 < 0 ? 0 : volume - 0.2;
      changeVolume(Number(newVolume.toFixed(1)));
    }
  };

  onCoverClick = () => {
    const { currentSong, trackList, changeCurrentSong, nowPlaying } = this.props;
    if (!currentSong) {
      changeCurrentSong(trackList.data[0]);
      nowPlaying();
    }
  };

  onFavoritesClick = () => {
    const { showFavorites } = this.props;
    showFavorites(true);
  };

  render() {
    const { color } = this.props;
    if (this.props.object.type === 'playlist') {
      const { title, duration, nb_tracks, link, picture_big } = this.props.object;
      let minutes, seconds, hours;
      if (duration > 3599) {
        hours = Math.floor(duration / 3600);
        minutes = Math.floor((duration - hours * 3600) / 60);
        seconds = duration - hours * 3600 - minutes * 60;
      } else {
        hours = null;
      }

      return (
        <StyledHeader color={color}>
          <img src={picture_big} alt="Playlsit Cover" onClick={this.onCoverClick} />
          <p className="details">
            {nb_tracks} Tracks | {hours ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`}
          </p>
          <h1>{title}</h1>
          <div className="deezer">
            <a href={link} target="blank">
              <Deezer />
            </a>
          </div>

          <div className="favorites-box">
            <div className="volume-box" onClick={this.onVolumeChange}>
              <Icon icon="volminus" fill={color} />
              <Icon icon="volplus" fill={color} />
            </div>
            <button className="favorites" onClick={this.onFavoritesClick}>
              Favoritos
            </button>
          </div>
        </StyledHeader>
      );
    }

    if (this.props.object.type === 'track') {
      const { title, duration, link, md5_image } = this.props.object;
      const minutes = Math.floor(duration / 60);
      const seconds = duration - minutes * 60;

      return (
        <StyledHeader color={color}>
          <img
            src={`https://e-cdns-images.dzcdn.net/images/cover/${md5_image}/264x264-000000-80-0-0.jpg`}
            alt="Capa da música"
          />
          <p className="details">{`${minutes}m ${seconds}s`}</p>
          <h1>{title}</h1>
          <div className="deezer">
            <a href={link} target="blank">
              <Deezer />
            </a>
          </div>

          <div className="favorites-box">
            <div className="volume-box" onClick={this.onVolumeChange}>
              <Icon icon="volminus" fill={color} />
              <Icon icon="volplus" fill={color} />
            </div>
            <button className="favorites" onClick={this.onFavoritesClick}>
              Favoritos
            </button>
          </div>
        </StyledHeader>
      );
    }
    return (
      <StyledSongHeader>
        <h3>
        Estamos enfrentando dificuldades para buscar seus dados. Por favor, tente novamente em alguns instantes.
        </h3>
      </StyledSongHeader>
    );
  }
}

const StyledSongHeader = styled.div`
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledHeader = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${lightGrey};
  font-family: sans-serif;

  .volume-box {
    height: 60px;
    width: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  img {
    max-height: 60vh;
    cursor: pointer;
    &:hover {
      outline: 1px solid ${(props) => (props.color ? props.color : 'none')};
    }
  }

  .details {
    margin: 1rem;
    font-size: 0.8rem;
  }

  .deezer {
    position: absolute;
    left: 2rem;
    bottom: 3rem;
  }

  .favorites-box {
    position: absolute;
    height: 80px;
    width: 160px;
    right: 2rem;
    bottom: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .favorites {
      margin-left: 1rem;
      width: 80px;
      height: 30px;
      color: white;
      font-family: sans-serif;
      font-weight: bold;
      background-color: ${(props) => (props.color ? props.color : 'black')};
      border: none;
      cursor: pointer;
      transition: transform 0.2s, background-color 1s;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  @media only screen and (max-width: 1000px) {
    .favorites-box {
      .favorites {
        cursor: default;
      }
    }

    .deezer {
      a {
        cursor: default;
      }
    }
  }

  @media only screen and (max-width: 1000px) {
    font-size: 0.8rem;
    img {
      height: 15rem;
      cursor: default;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    currentSong: state.currentSong,
    trackList: state.trackList,
    color: state.color,
    volume: state.volume,
  };
};

export default connect(mapStateToProps, {
  showFavorites,
  changeCurrentSong,
  nowPlaying,
  changeVolume,
})(Header);
