node {
    checkout scm
    docker.image('docker.elastic.co/elasticsearch/elasticsearch-oss:7.5.1').withRun('-e "discovery.type=single-node"') { c -> 
        docker.image('node:12.13.1').inside("--link ${c.id}:db") {
            withEnv([
                'SERVER_HOSTNAME=db',
                'JENKINS=true',
                'NODE_ENV=test',
                'PROTOCOL=http',
                'HOSTNAME=localhost',
                'PORT=8888',
                'ELASTICSEARCH_PROTOCOL=http',
                'ELASTICSEARCH_HOSTNAME=172.17.0.2',
                'ELASTICSEARCH_PORT=9200',
                'ELASTICSEARCH_INDEX=test'
            ]) {
                stage('Waiting') {
                    sh 'until curl --silent $DB_PORT_9200_TCP_ADDR:$ELASTICSEARCH_PORT -w "" -o /dev/null; do sleep 1; done'
                }
                stage('Install dependencies') {
                    sh 'yarn install'
                }
                stage('Start test server') {
                    sh 'yarn run test:run:server &'
                }
                stage('Unit Tests') {
                    sh 'yarn run test:unit'
                }
                stage('Integration Tests') {
                    sh 'yarn run test:integration'
                }
                stage('Delete the test table before running tests') {
                    sh 'curl --silent -o /dev/null -X DELETE "$ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT/$ELASTICSEARCH_INDEX"'
                }
                stage('End-to-End (E2E) Tests') {
                    sh 'yarn run test:e2e'
                }
            }
        }
    }
}
