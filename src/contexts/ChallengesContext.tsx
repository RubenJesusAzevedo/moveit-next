import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

export const ChallengesContext = createContext({} as ChallengesContextData);

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}
interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenges: () => void;
    completeChallenge: () => void;
}

interface ChanllengesProviderProps {
    children: ReactNode;
}
export function ChallengesProvider ({ children }: ChanllengesProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level+1) * 4, 2);

    // Array vazio executado apenas uma vez
    useEffect(() => {
        Notification.requestPermission();
    }, [])
    
    function levelUp(){
        setLevel(level + 1);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        
        setActiveChallenge(challenge);
        
        new Audio('notification.mp3').play();

        if(Notification.permission === 'granted') {
            new Notification('Novo Desafio', {
                body: `É para ${challenge.amount}xp!`
            });
        }
    }

    function resetChallenges(){
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if(!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider 
        value={{
            level,
            currentExperience,
            challengesCompleted,
            levelUp,
            startNewChallenge,
            activeChallenge,
            resetChallenges,
            experienceToNextLevel,
            completeChallenge,
            }}
        >
            {children}
        </ChallengesContext.Provider>
    );
}
