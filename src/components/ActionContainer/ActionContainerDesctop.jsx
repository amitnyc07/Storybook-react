import styles from "./ActionContainerDesktop.module.scss";
import meetingStyle from "../Meeting/MeetingDescktop.module.scss"
import { any, string } from 'prop-types';
import { MEETING_TYPES } from "utils/constants";
import moment from 'moment';
import ActionItemDesktop from '../ActionItem/ActionItemDesktop';

const ActionContainerDesktop = ({ id, meeting, transcription , removeActionItem=()=>null}) => {
  const typeStyle = () => {
    if (meeting.type === MEETING_TYPES[0]) {
      return meetingStyle.meetingType0
    } else {
      return meetingStyle.meetingType1
    }
  }


  const getUtterances = () => {
    // console.log("getUtterances", { transcription })
    if (transcription !== null) {
      return (
        <div className={styles.action_container__action_item_list}>
          {/* {transcription.transcript} */}
          {
            transcription.actionItems.map((speaker, index) => (
              <ActionItemDesktop {...speaker} key={index}  onTrash={()=>{removeActionItem(index)}} />
            ))
          }
        </div>
      )

    } else {
      return "it is null"
    }

  }
  return (
    <div className={styles.action_container}>
      <div className={styles.action_container__header_content}>
        <div className={styles.action_container__header_title}>
          {meeting.name}
        </div>
        <div className={typeStyle()}>
          {meeting.type !== MEETING_TYPES[1] && meeting.type !== MEETING_TYPES[2] ? 'My meeting' : meeting.type}
        </div>
        <div className={styles.action_container__header_creation}>
          {moment(meeting.creation).format('M.D.YY')}
        </div>
      </div>
      <div className={styles.action_container__action_item_content}>
        {getUtterances()}
      </div>
    </div>

  );
};
ActionContainerDesktop.propTypes = {
  id: string,
  meeting: any,
  transcription: any,
  transcription_json: any
}

ActionContainerDesktop.defaultProps = {

}
export default ActionContainerDesktop;
