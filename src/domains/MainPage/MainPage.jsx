import React from 'react';
import RecruitmentsCompoent from './components/RecruitmentsCompoent';
import Banners from './components/Banners';
import DeadlineProjects from './components/DeadlineProjects'
import WriteBtn from './components/WriteBtn';
import MainBanner from './components/MainBanner';
const MainPage = () => {
    return (
        <>
           <MainBanner/>
            <DeadlineProjects/>
            <RecruitmentsCompoent/>
            <WriteBtn />
        </>
    );
};

export default MainPage;