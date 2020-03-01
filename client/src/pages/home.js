import React, { useEffect, useState } from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    banner: {
        display: 'flex',
        justifyContent: 'center'
    },
    bannerSubnavContainer: {
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: 80,
        backgroundColor: theme.palette.primary.dark,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    bannerSubnav: {
        maxWidth: 1200,
        '&:last-child': {
            borderRight: `2px solid ${theme.palette.secondary.main}`
        }
    },
    bannerItem: {
        display: 'flex',
        alignItems: 'center',
        borderLeft: `2px solid ${theme.palette.secondary.main}`,
        borderTop: `2px solid ${theme.palette.secondary.main}`,
        borderBottom: `2px solid ${theme.palette.secondary.main}`
    }
}))

const Home = () => {
    const classes = useStyles()
    const [screams, setScreams] = useState(null)
    let recentScreamsMarkup = screams ? (
        screams.map(scream => <p>{scream.body}</p>)
    ) : <p>Loading...</p>
    useEffect(() => {
        axios.get('/screams')
            .then(res => {
                setScreams(res.data)
            })
            .catch(err => console.log(err))
    }, [])
        return (
            <Grid container>
                <Grid item sm={12}>
                    <Typography className={classes.banner}>Laertes</Typography>
                </Grid>
                <Grid item sm={12}>
                    <div className={classes.bannerSubnavContainer}>
                        <Grid container className={classes.bannerSubnav}>
                            <Grid className={classes.bannerItem} justify="center" item sm={3} xs={12}>
                                <div>About</div>
                            </Grid>
                            <Grid className={classes.bannerItem} justify="center" item sm={3} xs={12}>
                                <div>Current Game</div>
                            </Grid>
                            <Grid className={classes.bannerItem} justify="center" item sm={3} xs={12}>
                                <div>Sponsors</div>
                            </Grid>
                            <Grid className={classes.bannerItem} justify="center" item sm={3} xs={12}>
                                <div>Team</div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            // <Grid container>
            //     <Grid item sm={8} xs={12}>
            //         {recentScreamsMarkup}
            //     </Grid>
            //     <Grid item sm={3} xs={12}>
            //         <p>Profile</p>
            //     </Grid>
            // </Grid>
        )
}

export default Home
