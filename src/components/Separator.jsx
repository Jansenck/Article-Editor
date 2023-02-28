import styled from "styled-components";

function Separator(props){

  const { id } = props;

  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', id);
  }

  const ondragStart = (event) => {
    event.dataTransfer.setData('text/plain', id);
  }

  return(
      <Line 
          draggable={true} 
          onDragStart={(event) => ondragStart(event)}
      >
      </Line>
  );
}

export default Separator;

const Line = styled.div`
    border: 1px solid #7b7b7b2a;
    margin-bottom: 40px;
`;