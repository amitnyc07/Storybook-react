import styles from "./ActionItemDesktop.module.scss";
import { ReactComponent as TrashCanIcon } from "assets/icons/TrashCan.svg";
import { number, string } from 'prop-types';
import { ACTION_KEYWORDS } from '../../utils/constants';
import { useState } from 'react'

const ActionItemDesktop = ({ speaker, start, text, onTrash=()=>null}) => {
  const getTime=(ms)=>{
    const yy = parseInt(ms/(1000*60*60))
    const mm = parseInt(ms/(1000*60)%60)
    const ss = parseInt(ms/(1000)%60)
    return `${yy!==0?yy+':':''}${mm}:${ss}`
  }
  const search_words=ACTION_KEYWORDS
  const getText = () => {
    // console.log({text})
    for(let activeString of search_words){
      text=text.replaceAll(activeString, `<b>${activeString}</b>`);
    }
    // const myArray = text.split(". ");
    // if(myArray[myArray.length-1].length<50 && myArray[myArray.length-1].includes('. ')===false){
    //   myArray.splice(myArray.length-1,1)
    //   return myArray.join('. ')+'.'
    // }
    return text;
    
  };
  const [confirmTrash, setConfirmTrash] = useState(false)
  const handleRemove = () => {
    setConfirmTrash(!confirmTrash)
  }
  return (
    <div className={styles.action_item}>
      <div className={styles.action_item__timestamp}>{getTime(start)}</div>
      <div>
        <p className={styles.action_item__speaker}>{speaker}</p>
        <p className={styles.action_item__description} dangerouslySetInnerHTML={{ __html: getText() }}></p>
      </div>
      {
        confirmTrash === false ?
          <button className={styles.action_item__delete_button} onClick={() => { handleRemove() }}>
            <TrashCanIcon />
          </button> :
          <div className={styles.trash_confirm_container}>
            <button className={styles.secondary_btn} onClick={() => { handleRemove() }}>
              Cancel
            </button>
            <button className={styles.primary_btn} onClick={() => { onTrash() }}>
              Delete
            </button>
          </div>
      }
    </div>
  );
};
ActionItemDesktop.propTypes = {
  speaker: string,
  start: number,
  text: string
}

ActionItemDesktop.defaultProps = {
  speaker: 'Speaker1',
  start: 0,
  text: string
}
export default ActionItemDesktop;
