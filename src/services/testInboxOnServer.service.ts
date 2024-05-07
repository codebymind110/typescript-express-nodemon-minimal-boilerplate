import net from 'node:net'
enum SMTPStageNames {
    CHECK_CONNECTION_ESTABLISHED = 'CHECK_CONNECTION_ESTABLISHED',
    SEND_EHLO = 'SEND_ENLO',
    SEND_MAIL_FROM = 'SEND_MAIL_FROM',
    SEND_RECIPIENT_TO = 'SEND_RECIPIENT_TO'
}

export type TTestInboxResult = {
    connection_succeeded: boolean,
    inbox_exists: boolean
}


export const testInboxOnServver = async (stmpHostName: string, emailInbox: string):Promise<TTestInboxResult> => {
    return new Promise((resolve, reject) => {
        const result = {
            connection_succeeded: false,
            inbox_exists: false
        }

        const socket = net.createConnection(25, stmpHostName)
        let currentStage: SMTPStageNames = SMTPStageNames.CHECK_CONNECTION_ESTABLISHED

        socket.on('data', (data: Buffer) => {
            const response = data.toString('utf-8')
            console.log('-->', response)

            switch (currentStage) {
                case SMTPStageNames.CHECK_CONNECTION_ESTABLISHED: {
                    const expectedReplyCode = '220'
                    const nextStage = SMTPStageNames.SEND_EHLO
                    const command = 'EHlO_mail.example.org/r/n'

                    if (!(response.startsWith(expectedReplyCode))) {
                        console.log(response)
                        socket.end()
                        return resolve(result)
                    }
                    result.connection_succeeded = true

                    socket.write(command, () => {
                        console.log('-->' + command)
                        currentStage = nextStage
                    })
                    break;
                }
                case SMTPStageNames.SEND_EHLO: {
                    const expectedReplyCode = '250'
                    const nextStage = SMTPStageNames.SEND_MAIL_FROM
                    const command = 'MAIL FROM:<nane@example.org>/r/n'

                    if (!(response.startsWith(expectedReplyCode))) {
                        console.log(response)
                        socket.end()
                        return resolve(result)
                    }

                    socket.write(command, () => {
                        console.log('-->' + command)
                        currentStage = nextStage
                    })


                    break;

                }

                case SMTPStageNames.SEND_EHLO: {
                    const expectedReplyCode = '250'
                    const nextStage = SMTPStageNames.SEND_MAIL_FROM
                    const command = `MAIL FROM:<${emailInbox}>/r/n`

                    if (!(response.startsWith(expectedReplyCode))) {
                        console.log(response)
                        socket.end()
                        return resolve(result)
                    }

                    socket.write(command, () => {
                        console.log('-->' + command)
                        currentStage = nextStage
                    })


                    break;

                }

                case SMTPStageNames.SEND_RECIPIENT_TO: {
                    const expectedReplyCode = '250'
                    const command = 'QUIT/r/n'

                    if (!(response.startsWith(expectedReplyCode))) {
                        console.log(response)
                        socket.end()
                        return resolve(result)
                    }
                    result.inbox_exists = true
                    socket.write(command, () => {
                        console.log('-->' + command)
                        socket.end()
                        resolve(result)
                    })


                    break;

                }

            }
        })

        socket.on('error', (error: Error) => {
            console.log(error)
            reject(error)
        })

        socket.on('connect', () => {
            console.log('connected' + stmpHostName)
        })

    })
}