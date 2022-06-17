import React, { useState, useEffect } from 'react';
import styles from './MyActionItems.module.scss';
import PharagraphTitle from 'components/Home/PharagraphTitle';

import { getAllUserTranscriptions } from 'utils';
import { useStateValue } from 'state';
import Loader from 'components/Loader/Loader';
import ActionContainer from 'components/ActionContainer';
import PharagraphTitleTablet from '../../components/PharagraphTitleV1/PharagraphTitle';
import ActionContainerTablet from '../../components/ActionContainer/ActionContainerTablet';
import { PageHeader, SearchInput } from 'components';
import ActionContainerDesktop from '../../components/ActionContainer/ActionContainerDesctop';
import { MEETING_TYPES } from 'utils/constants';
import { updateUserTranscript } from '../../utils/firebase';
import { MEETING_STATUS } from '../../utils/constants';

const MyActionItems = () => {
    const [meetingsLoad, setMeetingsLoad] = useState(false)
    const [meetings, setMeetings] = useState([])
    const { state: { auth, deviceSize } } = useStateValue();
    useEffect(() => {
        // console.log({ auth })
        const uid = auth.user.uid
        setMeetingsLoad(true)
        // console.log("loading transcripts")
        getAllUserTranscriptions(uid).then(data => {
            // console.log('data======>', data)
            // setMeetingsByDate(data.groupByKey)
            setMeetings(filterMeetings(data))
            setMeetingsLoad(false)
        })

    }, [auth])
    const filterMeetings = (data) => {
        return data.filter((x, mmIdx) => {
            if (x.meeting === null) return false
            if (x.transcription.actionItems === undefined) return false
            if (x.transcription.actionItems.length > 0 && x.meeting.type !== MEETING_TYPES[2]) return true
            return false
        })
    }
    // console.log({ deviceSize })
    const handleRemoveActionItem=(meeting, aIdx)=>{
        // console.log({meeting, aIdx})
        meeting.transcription.actionItems.splice(aIdx, 1)
        const uid = auth.user.uid
        updateUserTranscript(uid, meeting.id, {actionItems: meeting.transcription.actionItems})
        const tempMeetings =  meetings
        const index=tempMeetings.findIndex(x=>x.id===meeting.id)
        tempMeetings[index]=meeting
        setMeetings(filterMeetings(tempMeetings))

    }
    if (['xs', 'sm', 'md'].includes(deviceSize)) {
        return (
            <React.Fragment>
                <div className={styles.action_content}>
                    <PharagraphTitle title={'Action Items'} align="left" />
                    {
                        meetingsLoad === true ? <Loader />
                            : <>
                                {
                                    meetings.map((meeting) => (
                                        <ActionContainer key={meeting.id} {...meeting}  removeActionItem={(idx)=>{handleRemoveActionItem(meeting, idx)}}/>
                                    ))
                                }
                            </>
                    }
                </div>
            </React.Fragment>
        )
    } else if (['lg', 'xl'].includes(deviceSize)) {
        return (
            <React.Fragment>
                <div className={styles.action_page_container}>
                <PageHeader showSearchIcon>Action Items</PageHeader>
                    <div className={styles.action_content}>
                        {
                            meetingsLoad === true ? <Loader />
                                : <>
                                    {
                                        meetings.map((meeting) => (
                                            <ActionContainerTablet key={meeting.id} {...meeting}  removeActionItem={(idx)=>{handleRemoveActionItem(meeting, idx)}}/>
                                        ))
                                    }
                                </>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment>
                <div className={styles.action_desktop_page_container}>
                    <PageHeader showSearchIcon>Action Items</PageHeader>
                    <div className={styles.action_content}>
                        {
                            meetingsLoad === true ? <Loader />
                                : <>
                                    {
                                        meetings.map((meeting) => (
                                            <ActionContainerDesktop key={meeting.id} {...meeting}  removeActionItem={(idx)=>{handleRemoveActionItem(meeting, idx)}}/>
                                        ))
                                    }
                                </>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }

};

export default MyActionItems;