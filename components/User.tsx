



import styles from '../styles/Home.module.css'
import {useState, useEffect, useContext} from 'react'
import AppContext from '../AppContext'
import { db } from '../firebase/Firebase'
import { collection, getDoc, doc, query, orderBy, addDoc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faXmarkCircle, faBars, faHouse, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faFacebook, faReddit } from '@fortawesome/free-brands-svg-icons'

const User = ({usernav, setUsernav}:any) => {
	const {logOut} = useContext(AppContext)
	// getting the users
	const usersRef = query(collection(db, 'users'))
	const users = useCollectionData(usersRef)[0]
	return (
		<section className={`flex flex-col justify-between ${styles.usersList} h-full bg-[rgba(50,50,50,1)] ${styles.users} ${usernav ? 'p-4 w-full' : 'p-0 w-0'} md:w-full md:p-4 outline outline-2 outline-black`}>
			<div>
				<div className={`md:hidden ${usernav ? '' : 'hidden'} flex w-full flex-row justify-end`}>
					<FontAwesomeIcon icon={faXmarkCircle} onClick={() => setUsernav(false)} className="md:hidden fa-xl"/>
				</div>
				<div className="flex flex-row justify-center items-center w-fit mb-2">
					<FontAwesomeIcon icon={faCircleArrowLeft} className="fa-3x mr-1"/>
					<div className="p-2 mb-1 rounded-md bg-[rgba(100,100,100,0.5)] hover:bg-white w-fit h-fit text-white">
						<a href={`/`}>Global Chat</a>
					</div>
				</div>
				{
					users && users.map((user) => {
						return (
							<div key={user.id} className="flex flex-row justify-center items-center w-fit mb-2">
								<img src={user.picture ? user.picture : "https://avatars.dicebear.com/api/bottts/" + user.name + ".svg"} alt="../public/vercel.svg" className="rounded-full mr-1 w-12 border border-2"/>
								<div className="p-2 mb-1 rounded-md bg-[rgba(100,100,100,0.5)] hover:bg-white w-fit h-fit text-white">
									<a href={`/chat/${user.uid}`}>{user.name}</a>
								</div>
							</div>
						)
					})
				}
			</div>
			<div className="px-4 py-2 bg-blue-400 w-fit rounded-lg" onClick={() => logOut()}>Log Out</div>
		</section>
	)
}

export default User
