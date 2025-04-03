def shoutOut() {
    sh 'echo Hello from the devops team, hope your day is going alright...'
}

def call() {
    shoutOut()
}