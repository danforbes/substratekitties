import { useContext } from 'react';
import KittyTabContext from './KittyContext';

export default () => {
  const context = useContext(KittyTabContext);
  return context;
};
