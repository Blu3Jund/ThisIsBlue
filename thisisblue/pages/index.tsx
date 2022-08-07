import styles from '../styles/Home.module.css'

import Loader from '../components/loader'
import toast from "react-hot-toast";



export default function Home() {
  return (
      <div>
          <button onClick={() => toast.success('hello toast!')}>
              Toast me
          </button>
        {/*<Loader show />*/}
      </div>
    // <div className={styles.container}>
    //
    // </div>
  )
}
