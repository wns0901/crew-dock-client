import React from 'react';
import DeadlineProjects from './components/DeadlineProjects';
import RecruitmentsCompoent from './components/RecruitmentsCompoent';
import Banners from './components/banners';
import WriteRecruitmentPost from './components/WriteRecruitmentPost';
import WriteBtn from './components/WriteBtn';

const MainPage = () => {
    return (
        <>
            <Banners/>
            <DeadlineProjects/>
            <RecruitmentsCompoent/>
            <WriteBtn />
            {/* <WriteRecruitmentPost/> */}
        </>
    );
};

export default MainPage;