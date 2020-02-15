import * as bodyParser from 'body-parser'
import * as controllers from './controllers'
import { Server as CoreServer } from '@overnightjs/core'

export class Server extends CoreServer {

    private readonly SERVER_STARTED = 'Server started on port: '

    constructor() {
        super(true);
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: true}))
        this.setupControllers()
    }

    private setupControllers(): void {
        const ctlrInstances = [];
        for (const name in controllers) {
            if (Object.prototype.hasOwnProperty.call(controllers, name)) {
                const controller = (controllers as any)[name]
                ctlrInstances.push(new controller())
            }
        }
        super.addControllers(ctlrInstances)
    }

    public start(port: number): void {
        this.app.get('*', (req, res) => {
            res.send(this.SERVER_STARTED + port)
        })
        this.app.listen(port, () => {
            console.log(this.SERVER_STARTED + port)
        })
    }
}