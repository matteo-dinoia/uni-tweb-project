package json.errors;

public class FatalError extends Error{
    public final int errorCode;

    public FatalError(int errorCode, String errorMsg){
        super(errorMsg);
        this.errorCode = errorCode;
    }
}
