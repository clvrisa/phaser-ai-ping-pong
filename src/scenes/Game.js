import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
    init() 
    {
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)
        this.leftScore = 0
        this.rightScore = 0
    }
    preload() 
    {

    }
    create() 
    {
        //set bounds to allow ball to go out of screen and come back
        this.physics.world.setBounds(-100, 0, 1000, 500)
        //create ball
        this.ball = this.add.circle(400, 250, 10, 0xffffff, 1)
        //add physics to ball 
        this.physics.add.existing(this.ball)
        //set ball bounce
        this.ball.body.setBounce(1, 1)
        //bounce from outer border
        this.ball.body.setCollideWorldBounds(true, 1, 1)

        this.resetBall()

        //create user left side paddle
        this.paddleLeft = this.add.rectangle(30, 250, 20, 100, 0xfffff, 1)
        //add physics to left side paddle
        this.physics.add.existing(this.paddleLeft, true)

        //create AI right side paddle
        this.paddleRight = this.add.rectangle(770, 250, 20, 100, 0xfffff, 1)
        //create physics to right side paddle
        this.physics.add.existing(this.paddleRight, true)

        //set collider of left side paddle and ball 
        this.physics.add.collider(this.paddleLeft, this.ball)
        //set collider of AI right side paddle and ball 
        this.physics.add.collider(this.paddleRight, this.ball)

        //set score and title style 
        const titleStyle =
        {
            fontFamily: 'monospace',
            fontSize: 30
        }
        const scoreStyle = 
        {
            fontFamily: 'monospace',
            fontSize: 48,

        }
        //set score board title
        this.add.text(130, 50, 'Player 1', titleStyle)
        this.add.text(530, 50, 'Player 2', titleStyle)

        //set left side paddle user score
        this.leftScoreLabel =
            this.add.text(200, 125, '0', scoreStyle)
            .setOrigin(0.5, 0.5)
        //set right side paddle AI score
        this.rightScoreLabel = 
        this.add.text(600, 125, '0', scoreStyle)
            .setOrigin(0.5, 0.5)

        //create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    update() 
    {
        // move left side paddle according to USER cursor keys
        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body = this.paddleLeft.body

        if(this.cursors.up.isDown)
        {
            //move game object left paddle up
                this.paddleLeft.y -= 10
                //move physics body along with gameobject 
                body.updateFromGameObject()
        }
        else if(this.cursors.down.isDown)
        {    
            //move game object left paddle down
            this.paddleLeft.y += 10
            //move physics body along with gameobject
            body.updateFromGameObject()
        }

        //move right side AI paddle
        //determine difference for AI paddle to follow
        const diff = this.ball.y - this.paddleRight.y
        if(Math.abs(diff) < 10)
        {
            return
        }
        //determine AI right side paddle speed
        const aiSpeed = 5
        if(diff < 0) //means ball is above the paddle 
        {
            //move game object AI right paddle up
            this.paddleRightVelocity.y = -aiSpeed
            if(this.paddleRightVelocity.y < -10)
            {
                this.paddleRightVelocity.y = -10
            }
        }
        else if (diff > 0) //means ball is below the paddle
        { 
            //move game object AI right paddle down
            this.paddleRightVelocity.y = aiSpeed
            if(this.paddleRightVelocity.y > 10)
            {
                this.paddleRightVelocity.y = 10
            }
        }
        this.paddleRight.y += this.paddleRightVelocity.y
        //move physics body along with right paddle AI gameobject
        this.paddleRight.body.updateFromGameObject()

        if(this.ball.x < -30)
        {
            // scored on the left user side
            this.resetBall()
            this.incrementLeftScore()
        }
        else if(this.ball.x > 830)
        {
            //scored on the right AI side 
            this.resetBall()
            this.incrementRightScore()
        }
    }

    incrementLeftScore () 
    {
        this.leftScore++
        this.leftScoreLabel.text = this.leftScore
    }
    incrementRightScore()
    {
        this.rightScore++
        this.rightScoreLabel.text = this.rightScore
    }
    //create method used to reset the ball 
    resetBall ()
    {   
        //reset ball position when ball goes out of bounds
        this.ball.setPosition(400, 250)
        //steps to set ball velocity
        //define angle
        const angle = Phaser.Math.Between(0, 360)
        //convert angle to vector using angle and speed as parameters
        const vec = this.physics.velocityFromAngle(angle, 250)
        
        //set ball velocity using vec 
        this.ball.body.setVelocity(vec.x, vec.y)
    }
}
