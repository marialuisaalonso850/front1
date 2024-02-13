import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import {Button} from 'reactstrap';

function Mapa({ posts }) {
  const defaultCenter = [4.5236039, -75.7090892];

  return (
    <div style={{ height: '400px' , padding: '30px' }}>
      <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        { posts && posts.map((post) => (
          <Marker key={post._id} position={[post.latitud, post.longitud]}>
            <Popup>
              <br />
              <strong>Parqueadero:</strong> {post.title}
              <br />
              <strong>Dirección:</strong> {post.content}
              <Link to='/ReservaYReservas'>
              <Button>Puestos</Button>

              </Link>

            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Mapa;