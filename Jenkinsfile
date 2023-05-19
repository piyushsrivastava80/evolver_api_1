node(){
    stage('Cloning Git') {
        checkout scm
    } 
        
    stage('Install dependencies backend') {
        nodejs('nodejs') {
            sh 'npm install --force'
            sh 'npm install --legacy-peer-deps'
            echo "Modules installed"
        }
        
    }
    stage('Build') {
        nodejs('nodejs') {
            sh 'node app.js'
            echo "Build completed"
        }        
    }

    stage('Package Build') {
        sh "tar -zcvf bundle.tar.gz dist/api/"
    } 
 
    stage('Artifacts Creation') {
        fingerprint 'bundle.tar.gz'
        archiveArtifacts 'bundle.tar.gz'
        echo "Artifacts created"
    }

    stage('Stash changes') {
        stash allowEmpty: true, includes: 'bundle.tar.gz', name: 'buildArtifacts'
    }
}

node('awsnode') {
    echo 'Unstash'
    unstash 'buildArtifacts'
    echo 'Artifacts copied'

    echo 'Copy'
    sh "yes | sudo cp -R bundle.tar.gz /var/www/html && cd /var/www/html && sudo tar -xvf bundle.tar.gz"
    echo 'Copy completed'
}