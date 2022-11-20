




import {useState, useEffect} from 'react'
import User from '../Components/User'
import Message from '../Components/Message'
import { db } from '../Firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs } from 'firebase/firestore'

const Home = () => {
	const [name, setName] = useState('')
	const [state, setState] = useState(false)
	const [uid, setUid] = useState('')
	const checkAuthState = () => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setState(true)
				setName(user.displayName!)
				setUid(user.uid!)
			} else {
				setState(false)
			}
		});
	}
	const signIn = () => {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
		.then((result) => {
			setName(auth.currentUser!.displayName!)
			setUid(auth.currentUser!.uid)
			setState(true)
		})
	}
	const send = () => {
		const node = (document.getElementById('input-field') as HTMLInputElement)
		const msg = node.value
		msg != '' ?
		addDoc(collection(db, 'global'), {
			user: name,
			uid: uid,
			message: msg,
			reacts: 0,
			timestamp: new Date(),
			replies: ''
		}) : console.log(msg)
		node.value = ''
	}
	const check = (event:any) =>{
		event.keyCode == 13 ? send() : null
	}
	const messagesRef = query(collection(db, 'global'), orderBy('timestamp'))
	const [messages] = useCollectionData(messagesRef)
	useEffect(() => {
		checkAuthState()
	}, [name])
	useEffect(() => {
		const node = document.getElementById('messages')
		node!.scrollTop = node!.scrollHeight
	}, [messages])
	return (
		<main className="sticky top-0 left-0 w-full h-screen max-w-[800px] m-auto flex flex-col border-2 border-black bg-[rgba(50,50,50,0.5)]">
			<div className="p-4 flex justify-between bg-black text-white MontAlt">
				<span>FireChat</span>
				<span>{name}</span>
				<div>
					<i className="fa-solid fa-right-to-bracket"></i>
				</div>
			</div>
			<section className="grow w-full flex flex-col overflow-y-scroll" id="messages">
				{
					messages && messages.map(msg => <Message key={msg.timestamp} message={msg.message} username={msg.user} pos={msg.uid == uid ? 'right' : 'left'}/>)
				}
			</section>
			<section className="flex justify-around items-center w-full p-2 bg-black">
				{
					state ? 
						<>
							<input type="text" className="h-10 rounded-full grow p-2 m-4" id="input-field" onKeyDown={(event) => check(event)}/>
							<div className="cursor-pointer" onClick={() => send()}>
								<i className="fa-solid fa-xl fa-paper-plane mr-4 text-white"></i>
							</div> 
						</>
						:
						<div className="p-4 rounded-full bg-blue-400 text-white" onClick={() => signIn()}>Login to send messages</div>
				}
			</section>
		</main>
	)
}

export default Home
