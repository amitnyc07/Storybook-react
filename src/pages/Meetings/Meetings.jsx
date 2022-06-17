/* eslint-disable react-hooks/exhaustive-deps */

import { Tab, Tabs } from '@mui/material';
import Meeting from 'components/Meeting/Meeting';
import PharagraphDateTitle from 'components/Meetings/PharagraphDateTitle';
import React, { useState, useEffect } from 'react';
import { useStateValue } from 'state';

import styles from './Meetings.module.scss';
import { styled } from '@mui/material/styles';

import './Meetings.module.scss';
import { deleteMeetings, onChangeMeetings } from 'utils';
import Loader from 'components/Loader/Loader';
import { MEETING_ACTIONS, MEETING_TYPES, PATHNAME } from 'utils/constants';
import { useNavigate } from 'hooks';
import DeletedMeeting from 'components/Meeting/DeletedMeeting';
import { SecondaryButton, SearchInput, Divider, PageHeader, AnimatedList } from 'components';
import DeleteMeetingModal from 'components/Modals/DeleteMeetingModal';
import { toast } from 'react-toastify';
import MeetingTablet from '../../components/Meeting/MeetingTablet';
import MeetingDesktop from 'components/Meeting/MeetingDesktop';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className={styles.tap_panel}
            {...other}
        >
            {value === index && (
                <div sx={{ p: 3 }}>
                    {children}
                </div>
            )}
        </div>
    );
}

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        width: '100%',
        backgroundColor: styles.colorHyperlink,
    },
});
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        color: styles.colorMain,
        '&.Mui-selected': {
            color: styles.colorHyperlink,
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
    }),
);

const Meetings = () => {
    const [tab, setTab] = useState(0)
    const handleChangeTab = (_, index) => {
        setTab(index)
        console.log({ meetings })
    }
    const [meetings, setMeetings] = useState([]);
    const [groupMeetings, setGroupMeetings] = useState([]);
    const { state: { auth, deviceSize } } = useStateValue();
    const [meetingsLoad, setMeetingsLoad] = useState(false);
    const navigate = useNavigate();
    const [selectedDeletedMeetings, setSelectedDeletedMeetings] = useState([]);
    const [isDeleteAll, setDeleteAll] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isProcessing, setProcessing] = useState(false);

    useEffect(() => {
        console.log({ auth })
        const uid = auth.user.uid
        setMeetingsLoad(true);
        const unsubscribe = onChangeMeetings(uid, (data) => {
            console.log({ data })
            const meetings_temp = data.meetings
            setMeetings([...meetings, ...meetings_temp])
            setGroupMeetings(data.groupBy)
            setMeetingsLoad(false)
        });
        return () => unsubscribe();
    }, [auth])
    // const today = new Date();
    const handleMeetingActions = (type, value) => {
        if(MEETING_ACTIONS.VIEW_DETAIL === type) navigate({ pathname: `${PATHNAME.MEETING}/${value.id}` });
        else if (MEETING_ACTIONS.DELETE_PERMANENTLY === type) {
            if(selectedDeletedMeetings.map(item => item.id).includes(value.id)) {
                setSelectedDeletedMeetings(selectedDeletedMeetings.filter(item => item.id !== value.id));
            } else {
                setSelectedDeletedMeetings([...selectedDeletedMeetings, value]);
            }
        }
    }

    const handleCheckDeleteAll = (event) => {
        setDeleteAll(event.target.checked)
        if (event.target.checked) {
            const deletedMeetings = meetings.filter(
                item => item.type === MEETING_TYPES[2] &&
                (item.creation - new Date()) / (1000 * 60 * 60 * 24) > -30);
                console.log(deletedMeetings);
            setSelectedDeletedMeetings(deletedMeetings);
        } else {
            setSelectedDeletedMeetings([]);
        }
    }

    const handleDeleteMeetings = () => {
        console.log(selectedDeletedMeetings.length, 'deleted');
        if (selectedDeletedMeetings.length > 0) {
            setOpenDelete(true)
        }
    }

    const handleDeleteDialogAction = (type) => {
        if (type === 'delete') {
            setProcessing(true);
            deleteMeetings(auth.user.uid, selectedDeletedMeetings)
                .then(data =>{
                    toast(data);
                    setProcessing(false);
                    setOpenDelete(false);
                    setSelectedDeletedMeetings([])
                })
        } else {
            setOpenDelete(false);
        }
    }

    if ('xxxl' === deviceSize) {
        return (
            <React.Fragment>
                <div className={styles.meetings_page}>
                    {['lg','xl', 'xxl', 'xxxl'].includes(deviceSize) && <PageHeader showSearchIcon>Anchored Meetings</PageHeader>}
                    <div className={styles.meetings_space}></div>
                    <Divider textAlign={'center'}>
                        <div className={styles.meetings_page__title}>
                            <StyledTabs
                                value={tab}
                                onChange={handleChangeTab}
                                className={styles.tab_container}
                            >
                                <StyledTab value={0} label="All" />
                                <StyledTab value={1} label="My meetings" />
                                <StyledTab value={2} label="Shared With Me " />
                                <StyledTab value={3} label="Recycle Bin" />
                            </StyledTabs>
                        </div>
                    </Divider>
                    {meetingsLoad === true && <Loader />}
                    <TabPanel value={tab} index={0}>
                        <div className={styles.meetingContainer}>
                            {
                                groupMeetings.map(({ key, value }) => (
                                    <div key={key}>
                                        {value?.filter(x => x.type !== MEETING_TYPES[2]).length ? <PharagraphDateTitle date={key} /> : ''}
                                        <AnimatedList
                                            className={styles.meeting_day_container}
                                            list={value?.filter(x => x.type !== MEETING_TYPES[2])}
                                            renderItem={(meeting) => (
                                                <div className={styles.meeting_card_container}>
                                                    <MeetingDesktop key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                ))
                            }
    
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <div className={styles.meetingContainer}>
                            {
                                groupMeetings.map(({ key, value }) => (
                                    <div key={key}>
                                        {value?.filter(x => x.type === MEETING_TYPES[0]).length ? <PharagraphDateTitle date={key} /> : ''}
                                        <AnimatedList
                                            className={styles.meeting_day_container}
                                            list={value?.filter(x => x.type === MEETING_TYPES[0])}
                                            renderItem={(meeting) => (
                                                <div className={styles.meeting_card_container}>
                                                    <MeetingDesktop key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <div className={styles.meetingContainer}>
                            {
                                groupMeetings.map(({ key, value }) => (
                                    <div key={key}>
                                        {value?.filter(x => x.type === MEETING_TYPES[1]).length ? <PharagraphDateTitle date={key} /> : ''}
                                        <AnimatedList
                                            className={styles.meeting_day_container}
                                            list={value?.filter(x => x.type === MEETING_TYPES[1])}
                                            renderItem={(meeting, index) => (
                                                <div className={styles.meeting_card_container}>
                                                    <MeetingDesktop key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        <div className={styles.meetingContainer}>
                            <div className={styles.meeting_delete_actions}>
                                <div className={styles.delete_select_all}>
                                Select All Meetings:
                                    <input type='checkbox' checked={isDeleteAll} onChange={handleCheckDeleteAll}/>
                                </div>
                                <SecondaryButton classNames={{button: styles.delete_meetings}} onClick={handleDeleteMeetings}>
                                    Delete Meetings ({selectedDeletedMeetings.length})
                                </SecondaryButton>
                            </div>
                            {
                                groupMeetings.map(({ key, value }) => (
                                    <div key={key}>
                                        {value?.filter(meeting => meeting.type === MEETING_TYPES[2] && (meeting.creation - new Date()) / (1000 * 60 * 60 * 24) > -30).length ? <PharagraphDateTitle date={key} /> : ''}
                                            <AnimatedList
                                                className={styles.meeting_day_container}
                                                list={value?.filter(meeting => meeting.type === MEETING_TYPES[2] && (meeting.creation - new Date()) / (1000 * 60 * 60 * 24) > -30)}
                                                renderItem={(meeting) => (
                                                    <div className={styles.meeting_card_container}>
                                                        <DeletedMeeting key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)}
                                                            selected={selectedDeletedMeetings.map(item => item.id).includes(meeting.id)}/>
                                                    </div>
                                                )}
                                            />
                                    </div>
                                ))
                            }
                        </div>
                    </TabPanel>
                    <DeleteMeetingModal
                        show={openDelete}
                        title={<>Are you sure you want to permanently <br/>delete ({selectedDeletedMeetings.length}) meetings?`</>}
                        description={'You will not be able to recover the meetings after this point.'}
                        onClose={()=>handleDeleteDialogAction('cancel')}
                        onSubmit={()=>handleDeleteDialogAction('delete')}
                        isProcessing={isProcessing}
                        mainButtonName={'Delete Meeting(s)'}
                    />
                </div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <div className={styles.meetings_page}>
                {['lg','xl', 'xxl'].includes(deviceSize) && <PageHeader showSearchIcon>Anchored Meetings</PageHeader>}
                <div className={styles.meetings_space}></div>
                <Divider textAlign={'center'}>
                    <div className={styles.meetings_page__title}>
                        <StyledTabs
                            value={tab}
                            onChange={handleChangeTab}
                            className={styles.tab_container}
                        >
                            <StyledTab value={0} label="All" />
                            <StyledTab value={1} label="My meetings" />
                            <StyledTab value={2} label="Shared With Me " />
                            <StyledTab value={3} label="Recycle Bin" />
                        </StyledTabs>
                    </div>
                </Divider>
                {meetingsLoad === true && <Loader />}
                <TabPanel value={tab} index={0}>
                    <div className={styles.meetingContainer}>
                        {
                            groupMeetings.map(({ key, value }) => (
                                <div key={key}>
                                    {value?.filter(x => x.type !== MEETING_TYPES[2]).length ? <PharagraphDateTitle date={key} /> : ''}
                                    <AnimatedList 
                                        list={value?.filter(x => x.type !== MEETING_TYPES[2])}
                                        renderItem={(meeting) => (['xs', 'sm', 'md'].includes(deviceSize) ?
                                            <Meeting key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                            :
                                            ['lg'].includes(deviceSize)?
                                            <MeetingTablet key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                            :
                                            <MeetingDesktop key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                        )}
                                    />
                                </div>
                            ))
                        }

                    </div>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <div className={styles.meetingContainer}>
                        {
                            groupMeetings.map(({ key, value }) => (
                                <div key={key}>
                                    {value?.filter(meeting => meeting.type === MEETING_TYPES[0]).length ? <PharagraphDateTitle date={key} /> : ''}
                                    <AnimatedList
                                        list={value?.filter(meeting => meeting.type === MEETING_TYPES[0])}
                                        renderItem={(meeting) => (['xs', 'sm', 'md'].includes(deviceSize) ?
                                            <Meeting key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                            :
                                            ['lg'].includes(deviceSize)?
                                            <MeetingTablet key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                            :
                                            <MeetingDesktop key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                        )}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    <div className={styles.meetingContainer}>
                        {
                            groupMeetings.map(({ key, value }) => (
                                <div key={key}>
                                    {value?.filter(meeting => meeting.type === MEETING_TYPES[1]).length ? <PharagraphDateTitle date={key} /> : ''}
                                    <AnimatedList
                                        list={value?.filter(meeting => meeting.type === MEETING_TYPES[1])}
                                        renderItem={(meeting) => (['xs', 'sm', 'md'].includes(deviceSize) ?
                                            <Meeting key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                            :
                                            ['lg'].includes(deviceSize)?
                                            <MeetingTablet key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                            :
                                            <MeetingDesktop key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)} />
                                        )}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </TabPanel>
                <TabPanel value={tab} index={3}>
                    <div className={styles.meetingContainer}>
                        <div className={styles.meeting_delete_actions}>
                            <div className={styles.delete_select_all}>
                            Select All Meetings:
                                <input type='checkbox' checked={isDeleteAll} onChange={handleCheckDeleteAll}/>
                            </div>
                            <SecondaryButton classNames={{button: styles.delete_meetings}} onClick={handleDeleteMeetings}>
                                Delete Meetings ({selectedDeletedMeetings.length})
                            </SecondaryButton>
                        </div>
                        {
                            groupMeetings.map(({ key, value }) => (
                                <div key={key}>
                                    {value?.filter(meeting => meeting.type === MEETING_TYPES[2] && (meeting.creation - new Date()) / (1000 * 60 * 60 * 24) > -30).length ? <PharagraphDateTitle date={key} /> : ''}
                                    <AnimatedList
                                        list={value?.filter(meeting => meeting.type === MEETING_TYPES[2] && (meeting.creation - new Date()) / (1000 * 60 * 60 * 24) > -30)}
                                        renderItem={(meeting) => (
                                            <DeletedMeeting key={"meetings" + meeting.id} {...meeting} onClick={(type) => handleMeetingActions(type, meeting)}
                                                selected={selectedDeletedMeetings.map(item => item.id).includes(meeting.id)}/>
                                        )}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </TabPanel>
                <DeleteMeetingModal
                    show={openDelete}
                    title={<>Are you sure you want to permanently <br/>delete ({selectedDeletedMeetings.length}) meetings?`</>}
                    description={'You will not be able to recover the meetings after this point.'}
                    onClose={()=>handleDeleteDialogAction('cancel')}
                    onSubmit={()=>handleDeleteDialogAction('delete')}
                    isProcessing={isProcessing}
                    mainButtonName={'Delete Meeting(s)'}
                />
            </div>
        </React.Fragment>
    )
};

export default Meetings;