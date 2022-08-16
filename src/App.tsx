import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import "regenerator-runtime/runtime";
import React, {useRef, useState} from 'react';
import './App.css';
import {mocks} from "./mocks/mocks";
import {Mocks, Ticket} from "./types/ticket";
import img from './assets/images/airplane.png'

function App() {
    const [newMocks, setNewMocks] = useState<Mocks>(mocks)
    const formRef = useRef<HTMLFormElement>(null);
    const sort = function () {
        mocks.tickets.sort((a: Ticket, b: Ticket) => {
            return a.price - b.price
        })
    };
    sort();

    const handleChange = function () {
        if (!formRef.current) {
            return;
        }

        const formData = new FormData(formRef.current);
        const stopsSet: Set<number> = new Set(Array.from(formData).map(entry => Number(entry[1])));

        let nMocks: Mocks = {
            tickets: mocks.tickets.filter(value => stopsSet.has(value.stops))
        }
        if (stopsSet.size === 0) {
            setNewMocks(mocks)
        } else setNewMocks(nMocks)
    }


    return (
        <div className="App">
            <img src={img} alt={'airplane'}/>
            <div className={'grid-container'}>
                <div className={'stops'}>
                    <div className={'form-container'}>
                        <h3>
                            Количество пересадок
                        </h3>
                        <form onChange={handleChange} ref={formRef}>
                            <label>

                                <input type={'checkbox'} value={0} name={'stops'}/>
                                Без пересадок
                            </label>
                            <label>

                                <input type={'checkbox'} value={1} name={'stops'}/>
                                1 Пересадка
                            </label>
                            <label>

                                <input type={'checkbox'} value={2} name={'stops'}/>
                                2 Пересадки
                            </label>
                            <label>

                                <input type={'checkbox'} value={3} name={'stops'}/>
                                3 Пересадки
                            </label>
                        </form>
                    </div>
                </div>
                <div className={'card-container'}>
                    {
                        newMocks.tickets.map((value, index) =>
                            <div className={'card'} key={index}>
                                <div className={'carrier'}>
                                    {value.carrier}
                                    <button className={'buy'}>
                                        Купить за {value.price}₽
                                    </button>
                                </div>
                                <div className={'card-info'}>
                                    <div className={'departure'}>
                                        <span className={'time'}>{value.departure_time}</span>
                                        <span className={'origin'}>{value.origin},{value.origin_name}</span>
                                        <span className={'date'}>{value.departure_date}</span>
                                    </div>

                                    <div className={'arrival'}>
                                        <span className={'time'}>{value.arrival_time}</span>
                                        <span className={'origin'}>{value.destination_name}, {value.destination}</span>
                                        <span className={'date'}>{value.arrival_date}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
