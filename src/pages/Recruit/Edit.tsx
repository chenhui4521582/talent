import React from 'react';
import NewDemand from './New';
import { updateDemand } from './services/list';

export default (props) => {
  const demandId: number = props.match.params.id;
  return (
    <NewDemand
      demandId={demandId}
      name="编辑需求"
      updateDemand={updateDemand}
    />
  )
}