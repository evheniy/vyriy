export const text = `Vyriy Project Master

Usage:
  vyriy [name]           Create a new Vyriy project
  vyriy .                Initialize a new Vyriy project in the current directory
  vyriy --help, -h       Show help
  vyriy --version, -v    Show version
  vyriy --check-env, -c  Check local environment
  vyriy --dist, -d       Prepare dist package metadata without publishing to npm
  vyriy --dry-run        Print checks and file plan without writing
  vyriy --overwrite      Overwrite existing generated paths
  vyriy --skip-existing  Leave existing generated paths untouched
  vyriy --no-install     Create files without installing dependencies
  vyriy --no-verify      Install dependencies without running checks

Examples:
  vyriy app
  vyriy .
  vyriy -d`;
export const help = async () => {
    console.log(text);
    await Promise.resolve();
    return 0;
};
