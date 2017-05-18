node("primary") {
  def credentialsId = '8aa93893-84cc-45fc-a029-a42f21197bb3'

  stage "Primary: make directories"
  sh "mkdir -p alloy-project"
  sh "mkdir -p jenkins-plumbing"

  stage "Primary: load shared pipelines"
  dir("jenkins-plumbing") {
     git ([url: "ssh://git@stash:7999/van/jenkins-plumbing.git", credentialsId: credentialsId]) 
  }
  def extBedrock = load("jenkins-plumbing/bedrock-tests.groovy")
  def exec = load("jenkins-plumbing/exec.groovy")
   
  dir("alloy-project") {    
    stage "Primary: checkout"
    git([branch: "master", url:'ssh://git@stash:7999/van/alloy.git', credentialsId: credentialsId])
    
    stage "Fetching dent dependencies"
    sh "dent"

    stage "Fetching npm dependencies"
    sh "npm install"

    stage "Running atomic tests"
    sh "grunt bolt-test"

    stage "Running phantomjs tests"
    sh "grunt bedrock-auto:phantomjs"
  }

  stage "Skipping browser tests ... not yet working"

  /*

  def permutations = [:]

  permutations = [
    [ name: "win10Chrome", os: "windows-10", browser: "chrome" ],
    [ name: "win10FF", os: "windows-10", browser: "firefox" ],
    [ name: "win10Edge", os: "windows-10", browser: "MicrosoftEdge" ],
    [ name: "win10IE", os: "windows-10", browser: "ie" ]
  ]

  def processes = [:]


  for (int i = 0; i < permutations.size(); i++) {
    def permutation = permutations.get(i);
    def name = permutation.name;
    processes[permutation.name] = {
      node("bedrock-" + permutation.os) {
        echo "Platform: checkout"
        git([branch: "master", url:'ssh://git@stash:7999/van/alloy.git', credentialsId: credentialsId])
        
        echo "Platform: dependencies"
        exec "dent"

        echo "Platform: browser tests for " + permutation.name
        extBedrock(permutation.name, permutation.browser, "src/test/js/browser")
      }
    }
  }

  stage "Browser Tests"
  parallel processes

  */

  stage "Skipping publishing ... this will be an npm project"
}


