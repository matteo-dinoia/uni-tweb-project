package json.errors;

public class LoggableError extends Error{
    public LoggableError(String errorMsg){
        super(errorMsg);
    }
}
