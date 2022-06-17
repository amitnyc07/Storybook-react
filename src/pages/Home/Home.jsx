import Meeting from 'components/Meeting/Meeting';
import React, { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import PharagraphTitle from 'components/Home/PharagraphTitle';
import Calendar from 'components/Home/Calendar';
import CalendarTablet from '../../components/Home/CallendarTablet';
import CalendarDesktop from 'components/Home/CalendarDesktop';
import { onChangeMeetings } from 'utils';
import { MEETING_ACTIONS, MEETING_TYPES, MONTH_NAMES, PATHNAME } from 'utils/constants';
import { useStateValue } from 'state';
import Loader from 'components/Loader/Loader';
import { AnimatedList, SearchInput } from 'components';
import MeetingTablet from '../../components/Meeting/MeetingTablet';
import styles1 from '../SearchResults/SearchResults.module.scss'
import HomeRecorder from 'components/Home/HomeRecorder/HomeRecorder';
import MeetingDesktop from 'components/Meeting/MeetingDesktop';
import { Divider } from '@mui/material';
import { useNavigate } from 'hooks';
import clsx from 'clsx';

const Home = () => {
    const [CurrentDate, setCurrentDate] = React.useState(new Date());
    const [meetingsByDate, setMeetingsByDate] = useState({});
    const [meetingsLoad, setMeetingsLoad] = useState(false)
    const [meetings, setMeetings] = useState([]);
    const navigate = useNavigate()

    const { state: { auth, deviceSize,settings, isNavOpened }} = useStateValue();
    const [dateKey, setDateKey] = useState('');

    useEffect(() => {
        const uid = auth.user.uid
        // console.log({uid})
        setMeetingsLoad(true);
        const unsubscribe = onChangeMeetings(uid, (data) => {
            setMeetingsByDate(data.groupByKey)
            // console.log({ data })
            const sortedByDate = data.meetings.sort((a, b) => (b.date.seconds - a.date.seconds))
            const validMeetings = sortedByDate.filter(item => item.type !== MEETING_TYPES[2])
            setMeetings(validMeetings)
            setMeetingsLoad(false)
        }, settings?.desktopNotification||true);
        return () => unsubscribe();
    }, [auth, settings])

    useEffect(() => {
        let tempKey = MONTH_NAMES[CurrentDate.getMonth()] + " " + CurrentDate.getDate() + ", " + CurrentDate.getFullYear();
        setDateKey(tempKey)
    }, [CurrentDate])

    const handleMeetingActions = (type, value) => {
        if (MEETING_ACTIONS.VIEW_DETAIL === type) navigate({ pathname: `${PATHNAME.MEETING}/${value.id}` });
    }

    if (['xs', 'sm', 'md'].includes(deviceSize)) {
        return (
            <React.Fragment>
                <div className={styles.homePage}>
                    <PharagraphTitle title={'Scheduled Meetings'} align="left"
                        classNames={
                            {
                                title: styles.title_scheduled,
                                container: styles.title_scheduled_container
                            }
                        } />
                    <div className={styles.calender_container}>

                        <Calendar
                            onChangeDate={(date) => {
                                // console.log({ meetingsByDate })
                                setCurrentDate(date)
                            }}
                            meetings={meetingsByDate[dateKey] !== undefined ? meetingsByDate[dateKey] : []} />
                    </div>

                    <PharagraphTitle title={"Anchored Meetings"} align="left" classNames={
                        {
                            title: styles.title_anchored,
                            container: styles.title_anchored_container
                        }
                    } />

                    <div className={styles.meetingContainer}>
                        {
                            meetings !== undefined && <AnimatedList list={meetings} renderItem={(meeting, index) => (
                                <Meeting key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                            )}/>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    } else if (['lg'].includes(deviceSize)) {
        return <React.Fragment>
            <div className={styles.tablet_container}>
                <div className={styles.search__top}>
                    <SearchInput classNames={{ container: styles1.search__form }} />
                </div>
                <div className={styles.home_page_tablet}>
                    <div>
                        {meetingsLoad === true ?
                            <Loader /> :
                            meetings !== undefined && <AnimatedList list={meetings} renderItem={(meeting, index) => (
                                <MeetingTablet key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                            )}/>
                        }
                    </div>
                    <div>
                        <CalendarTablet
                            onChangeDate={(date) => {
                                setCurrentDate(date)
                            }}
                            meetings={meetingsByDate[dateKey] !== undefined ? meetingsByDate[dateKey] : []} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
    return (
        <React.Fragment>
            <div className={clsx(styles.desktop_container, !isNavOpened && styles.desktop_container_collapse)}>
                <div className={styles.search__top_desktop}>
                    <SearchInput classNames={{ container: styles.search_input_desktop, button: styles.search_button }} iconVisible />
                </div>
                <Divider style={{ padding: 'unset !important' }} />
                <div className={styles.home_page_desktop}>
                    <div>
                        {meetingsLoad === true ?
                            <Loader /> :
                            meetings !== undefined && <AnimatedList list={meetings} renderItem={(meeting, index) => (
                                <MeetingDesktop key={"meetings_desktop" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                            )}/>
                        }
                    </div>
                    <div>
                        <HomeRecorder />
                        <CalendarDesktop
                        onChangeDate={(date) => {
                            setCurrentDate(date)
                        }}
                        meetings={meetingsByDate[dateKey] !== undefined ? meetingsByDate[dateKey] : []} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )

};

export default Home;