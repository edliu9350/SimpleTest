import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import utils from '../../utils';
import useStore from '../../store';

export default (props: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erros, setErros] = useState({
        email: '',
        password: ''
    });
    const setToken = useStore(state => state.setToken);
    const handleSubmit = (e: any) => {
        e.preventDefault();
    }
    const handleLogin = () => {
        if(password != '' && utils.validateEmail(email)){
            setToken({
                email,
                password
            });
            props.onClose();
        }
    }
    return (
        <Transition appear show={props.open} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={props.onClose}
            >
                 <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className="inline-block w-full text-white max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
                    <div className="mt-4">
                        <h1 className='text-2xl font-medium text-primary mt-4 mb-5 text-center'>
                            Log in to your account 🔐
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor='email'>Email</label>
                                <input
                                    required
                                    type='email'
                                    className={`w-full p-2 text-black text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                    id='email'
                                    placeholder='Your Email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <span className="text-xs tracking-wide text-red-200">{erros.email}</span>
                            </div>
                            <div className='mt-5 mb-5'>
                                <label htmlFor='password'>Password</label>
                                <input
                                    required
                                    type='password'
                                    className={`w-full p-2 text-black text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                    id='password'
                                    placeholder='Your Password'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <span className="text-xs tracking-wide text-red-200">{erros.password}</span>
                            </div>
                            <div className='flex justify-center items-center mt-3'>
                                <button
                                    className="py-2 px-4 w-full text-white roundedd border border-green text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
    )
}