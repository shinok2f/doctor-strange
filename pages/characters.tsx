import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Header } from '../src/components/Header/Header'
import styles from "./styles/Characters.module.scss"
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image'
import { LinearProgress } from '@mui/material';
import md5 from 'md5'
import axios from 'axios';

type Character = {
  [dados:string]:{
      name: string;
      image: string;
      description: string;
      skills: string;
      cast: string;
      mcu: string;
  } | any
}
type CharacterState = {
      name: string;
      imageCharacter: string;
      image: string;
      description:string;
      skills:{
        Powers:string;
        Grid:[]
      }

}

type SkillGridCharacter = {
      name:string;
      value:number;
}

type Comics = 
  {
    urls:{
    url:string;
  },
  thumbnail: {
    extension:string;
    path:string;
  },
  title: string,
}
interface ComicsArray extends Array<Comics>{}



function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Characters(props:Character) {
   
  const [value, setValue] = useState(0);

  const [ComicsValue, setComicsValue] = useState<ComicsArray>([]);

  console.log(ComicsValue)

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  }

  const characters = props.dados

  const [activeCharacter , setActiveCharacter] = useState<CharacterState>(
    {
      name: 'Doctor Strange',
      imageCharacter:'/images/doctor-home.png',
      image:'',
      description:characters[0].description,
      skills:characters[0].skills      
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      const publicKey = '43e48dfca53a5fc3a7d0c95b6f43bbe3'
      const privateKey = 'e777fe1cb241aef13cffde043c5d9cfaf4ffda28'
      const time = Number(new Date());
      const hash = md5(time + privateKey + publicKey)
      const result = await axios(
        `http://gateway.marvel.com/v1/public/comics?title=${activeCharacter.name}&limit=20&ts=${time}&apikey=${publicKey}&hash=${hash}`,
      );
      

      setComicsValue(result.data.data.results);
    };

    fetchData();
  }, [activeCharacter]);
  return (
      <div className={styles.Characters}>
        <Head>
          <title>Multiverse of madness - Doctor Strange</title>
          <meta name="description" content="Generated by create next app" />
        </Head>

        <Header/>
        <section className={styles.section}>
          <div className={styles.name}><h1>{activeCharacter.name}</h1></div>
          <div className={styles.characters}>
          <div className={styles.card}>
              <div className={styles.menu}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} textColor="inherit" sx={{
                        '& .MuiTabs-indicator': {
                        backgroundColor: 'red',
                        height:'5px',
                        },
                      }}>
                          <Tab sx={{ fontFamily:'Poppins',fontWeight:'bold'}} label="STORY" {...a11yProps(0)} />
                          <Tab sx={{ fontFamily:'Poppins',fontWeight:'bold'}} label="SKILLS" {...a11yProps(1)} />
                          <Tab sx={{ fontFamily:'Poppins',fontWeight:'bold'}} label="COMICS" {...a11yProps(2)} />
                        </Tabs>
                      </Box>
              </div>
              <div className={styles.character}>
                {
                    characters && characters.map((character:CharacterState)=>
                    <a  key={character.name} className={styles.characterSelect}><Image onClick={ ()=> setActiveCharacter(character)} src={character.image} width={100} height={100}/></a>     
                  )         
                }

                  <div>
                  <Box sx={{ width: '100%' }}>
                      <TabPanel value={value} index={0}>
                        <textarea value={activeCharacter.description}></textarea>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <div className={styles.skillsDiv}>
                          <div className={styles.skillPower}>
                            <h1>POWERS</h1>
                            <h2>{activeCharacter.skills.Powers}</h2>
                          </div>
                          <div className={styles.skillGrid}>
                            <h1>POWER GRID</h1>
                          {
                            activeCharacter.skills.Grid?.map((skillGrid:SkillGridCharacter)=>
                            <div key={skillGrid.name}>
                            <h2>{skillGrid.name}</h2>
                              <LinearProgress className={styles.SkillBar} sx={{width: 400,height:25}} variant="determinate" value={skillGrid.value}/>
                            </div>
                            )   
                          } 
                        </div>
                      </div>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        
                      <div className={styles.ComicsDiv}>
                          {(ComicsValue?.length > 0) ? 
                            ComicsValue?.map((comic)=>
                              <div key={comic?.title}>
                                <a href={comic?.urls.url} target="_blank" rel="noreferrer">
                                <Image src={`${comic?.thumbnail.path}.${comic?.thumbnail.extension}`}alt="" width={150} height={150}/>
                                <h2>{comic?.title}</h2>
                                </a>
                              </div>
                            ) : <h1>We couldn't find any comics for this character!</h1>  
                          } 
                        </div>
                      </TabPanel>
                    </Box>
                    </div>
                  </div>
              </div>
              <AnimatePresence>
                <motion.img
                  key={activeCharacter.imageCharacter}
                  src={activeCharacter.imageCharacter}
                  initial={{ x: 300, opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                />
              </AnimatePresence>
            </div>
      </section>
    </div>
  )
}

export async function getStaticProps() {
  // Fetch data from external API
  const res = await fetch(`https://doctor-strange.vercel.app/api/characters`)
  const dados = await res.json()
  // Pass data to the page via props
  return { 
    props: { dados},
    revalidate: 60,
  }
}