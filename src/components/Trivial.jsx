import { useState } from "react";
import "./Trivial.css";

const baseUrl = "https://opentdb.com/api.php?type=multiple&amount=";
const globalAnswers = [];
export default function Trivial(){
    const [questions, setQuestions] = useState([])
    const [correctAnswersCount, setCorrectAnswerCount] = useState()

    const startGame = async () => {
        const amount$$ = document.querySelector("[data-fn='amount']")
        const res = await fetch(baseUrl + amount$$.value)
        const resQuestions = await res.json();
        
        createSortedQuestions(resQuestions.results)
        setCorrectAnswerCount(undefined)
    }

    const createSortedQuestions = (questions) => {
        for (const question of questions) {
            question.answers = [question.correct_answer, ...question.incorrect_answers].sort(() =>  Math.random() - 0.5 )
        }

        setQuestions(questions)
    }

    const checkAnwser = (questionIndex, answer) => {
        const copyQuestions = [...questions];

        globalAnswers[questionIndex] = copyQuestions[questionIndex].correct_answer === answer;

        copyQuestions[questionIndex].selectedAnswer = answer;

        setQuestions(copyQuestions);
    }

    const checkGame = () =>{
        let count = 0
        for (const globalAnswer of globalAnswers) {
            if(globalAnswer){
                count++
            }
        }
        setCorrectAnswerCount(count)
    }
    return <div>
        <input data-fn="amount" type="text" />
        <button onClick={startGame}>Comenzar juego</button>

        <div>
            {questions.map((question, index) => <div key={index}>
                <h2>{question.question}</h2>
                <div>{question.answers.map((answer, answerIndex) => <div key={answerIndex}>
                    <p className={"c-trivial__answer " + (correctAnswersCount >= 0 ? answer === question.correct_answer ? "c-trivial__answer--true" : question.selectedAnswer === answer ? "c-trivial__answer--false" : "" : question.selectedAnswer === answer ? "c-trivial__answer--selected" : "")} onClick={() => checkAnwser(index, answer)}>{answer}</p>
                </div>)}</div>
            </div>)}
        </div>

        <button onClick={checkGame} className={"b-btn " + (globalAnswers.length === 0 || globalAnswers.length!== questions.length ? "u-disabled" : "")}>Comprobar resultados</button>

        {correctAnswersCount >= 0 && <p>Tienes {correctAnswersCount} respuestas correctas</p>}
    </div>
}