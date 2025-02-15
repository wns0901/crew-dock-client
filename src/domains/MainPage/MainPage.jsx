import React from 'react';
import RecruitmentsCompoent from './components/RecruitmentsCompoent';
import Banners from './components/Banners';
import DeadlineProjects from './components/DeadlineProjects'
import WriteBtn from './components/WriteBtn';

const MainPage = () => {
    return (
        <>
            {/* <Banners/> */}
            <DeadlineProjects/>
            <RecruitmentsCompoent/>
            <WriteBtn />
        </>
    );
};

export default MainPage;